/**
 * Created by Noir on 12/23/13.
 */

/**
 *
 * Summary
 *
 * GET  :       /loginMenu
 * GET  :       /login
 * POST :       /login
 * GET  :       /auth/facebook
 * GET  :       /auth/facebook/callback
 * GET  :       /auth/google
 * GET  :       /auth/google/callback
 * GET  :       /signup
 * POST :       /signup
 * GET  :       /profile
 * GET  :       /logout
 * POST :       /recovery
 * POST :       /recovery/checkUsername
 * POST :       /recovery/checkContact
 * GET  :       /resetPassword/:token
 * GET  :       /resetPassword
 *
 *
 */
'use strict'

var path = require('path')
    , User = require("../../models/user")
    , Admin = require("../../models/admin")
    , UserToken = require("../../models/userToken")
    , Conversation = require("../../models/conversation")
    , helper = require("../../../helper/helper")
    , mailHelper = require("../../../helper/mailHelper")
    , ObjectId = require('mongoose').Types.ObjectId
    , validator = require("../../../helper/userValidator");

exports.changeUserPassword = function(req, res, next){
    var password = req.body.password,
        userId = req.params.id,
        tokenId = req.body.token;

    // update password
    User.findOne({'_id':userId},function(err, user){
        if(err){
            console.log(err);
            return res.send(500, err);
        }

        if(user){
            // found user
            // update password
            user.local.password = password;

            user.save(function(err){
                if(err){
                    console.log(err);
                    return res.send(500, err);
                }

                // update password ok
                // remove user token
                UserToken.findOne({'token':tokenId},function(err, token){
                    if(err){
                        console.log('1'+err);
                        return res.send(500, err);
                    }
                    if(token){
                        // remove it
                        token.remove(function(err){
                            if(err)
                                return res.send(500, err);

                            return res.send(200, 'reseted');
                        });
                    }else{
                        // log
                        return res.redirect('/404');
                    }
                });
            });
        }else{
            return res.send(400, 'This user is no longer available');
        }
    });
}

exports.checkRecoveryToken = function(req, res, next){
    // check token is valid
    var token = req.params.token;
    var title = 'Reset password';
    UserToken.findOne({'token':token},function(err, userToken){
        if(err){
            console.log(err);
            return next();
        }

        // found this token
        if(userToken){
            // check if this userToken is expires or not
            if(userToken.expires < Date.now())
                return res.send(400, 'Your request is expired');
            // this still is available
            // reset password and render page to user input new password
            return res.send(200, {userId:userToken.userId});
        }else{
            return res.redirect('/404');
        }
    });
}


/**
 * ThuanNH
 *
 * check email of this user, if it's owned by this user
 * create a recovery token, then send it via email
 *
 * @param req
 * @param res
 * @param next
 */
exports.checkRecoveryEmail = function(req, res, next){
    // check this email if it's belong to this user
    // mongodb query: db.users.find({email:1.99, $or: [ { qty: { $lt: 20 } }, { sale: true } ] } )
    User.findOne({'local.username':req.params.username,'email':req.params.email}, function(err, user){
        if(err)
            return console.log(err);
        if(user){
            // user is match
            // create a token
            var userToken = new UserToken({
                userId:user._id,
                token: ''
            });

            userToken.save(function(err, userToken){
                if(err) return res.send(500, err);
                var resetUrl = 'http://localhost:8080/passwordrecover/' + userToken.token + '';
                // send a mail to their email and render success page
                mailHelper.sendResetPasswordMail(user.email, resetUrl, userToken.createDate, function(err, responseStatus, http, text){
                    if(err) return console.log(err);

                    return res.send(200, 'Message send successfully');
                });
            });
        }else{
            // user and email is not a match
            // display an error message
            return res.send(500, 'This is not your email address. Please enter the email address you registered to us');
        }
    });
}
/**
 * ThuanNH added
 *
 * check session
 *
 * @param req
 * @param res
 * @param next
 * @returns {*|Transport|EventEmitter|boolean|Request|ServerResponse}
 */
exports.checkSession = function(req, res, next){
    //console.log('day ne:   ' + JSON.stringify(req.session.passport.user));
    if(req.session.passport.user){
        if(req.session.passport.user.isAdmin){
            // is admin
            // is authenticated
            // then check user is available or not
            // check user is available or not
            Admin.findOne({'_id':req.session.passport.user.id},function(err, admin){
                if(err){
                    console.log('err: ' + err);
                    return next();
                }

                if(admin){
                    if(admin.isLocked){
                        // user is locked
                        req.logout();
                        return res.send(500);
                    }else{
                        if(admin.isBanned){
                            // user is banned by admin
                            return res.send(500,'banned');
                        }else{
                            return res.send(200, {
                                id:req.session.passport.user.id,
                                username: req.session.passport.user.username,
                                isAdmin: true
                            });
                        }
                    }
                }else{
                    req.logout();
                    return res.send(500);
                }
            });
        }else{
            // current user
            // is authenticated
            // then check user is available or not
            // check user is available or not
            User.findOne({'_id':req.session.passport.user.id},function(err, user){
                if(err){
                    console.log('err: ' + err);
                    return next();
                }

                if(user){
                    if(user.isLocked){
                        // user is locked
                        req.logout();
                        return res.send(500);
                    }else{
                        if(user.isBanned){
                            // user is banned by admin
                            return res.send(500,'banned');
                        }else{
                            // update user
                            req.session.passport.user.id = user._id;
                            req.session.passport.user.username = user.usernameByProvider;
                            req.session.passport.user.fullName = user.fullName;
                            req.session.passport.user.avatar = user.avatarByProvider;
                            req.session.passport.user.isAdmin = false;
                            return res.send(200, {
                                id:req.session.passport.user.id,
                                username: req.session.passport.user.username,
                                fullName: req.session.passport.user.fullName,
                                avatar: req.session.passport.user.avatar,
                                isAdmin: req.session.passport.user.isAdmin
                            });
                        }
                    }
                }else{
                    req.logout();
                    return res.send(500);
                }
            });
        }
    }else{
        return res.send(500);
    }
}
/**
 * ThuanNH added
 *
 * update user
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateUser = function(req, res, next){
    console.log('params ' + JSON.stringify(req.params));
    console.log('body ' + JSON.stringify(req.body));
}
/**
 * check unique for username and email
 *
 * @param req
 * @param res
 * @param next
 */
exports.checkUnique = function(req, res, next){
    var str = req.body.target;
    var type = req.body.type;
    str.toLowerCase();
    var query = (type=='username')?{'local.username':str}:{'email':str};
    User.count(query , function(err, n){
        if(err) return console.log(err);

        if(n<1){
            // doesn't exist
            return res.send(200, true);
        }else{
            // existed
            return res.send(500, false);
        }
    });
};

/**
 * log out
 *
 * @param req
 * @param res
 * @param next
 */
exports.logout = function(req, res, next){
        req.logout();
        return res.redirect('/');
};
/**
 * create a new account then log in
 *
 * @param req
 * @param res
 * @param next
 */
exports.signup = function(req, res, next) {
    // validate captcha
    var ipSolver = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress; // get ip of request
    // validate with outside server
    helper.validateCaptcha(req.body.responseCaptcha,ipSolver,function(err, result){
        if(err){
            if(err.code == 0){
                return res.send(200,{errCode: err.code, err: true});
            }else{
                console.log('ERR: ' + err.text);
                return res.send(200,{errCode: 0, err: true});
            }
        }

        // if captcha is valid, so let the user to create his account
        User.findOne({$or:[
            {'facebook.email':req.body.email},
            {'email':req.body.email}]
        },function(err, user){
            if(err) return res.send(200,{errCode: 0, err: true});

            if(user){
                // update this user
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.birthday = new Date(req.body.year, req.body.month, req.body.date);
                user.gender = req.body.gender;
                user.provider = "local";
                user.local.password = req.body.password;
                user.local.username = req.body.username;
                user.email = req.body.email;
                if(req.body.year !=='----' && req.body.month !== '--' && req.body.date !== '--'){
                    user.birthday = new Date(req.body.year, req.body.month, req.body.date);
                }

                user.save(function (err, user) {
                    if (err){
                        var errorMessage = helper.displayMongooseError(err);
                        return res.send(500, errorMessage);
                    }

                    req.logIn(user, function(err){
                        if(err) return next(err);
                        return res.redirect('/'); // created -> login -> redirect to this page
                    });
                });
            }else{
                // create new user
                var user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    gender: req.body.gender,
                    provider: "local"
                });
                if(req.body.year !=='----' && req.body.month !== '--' && req.body.date !== '--'){
                    user.birthday = new Date(req.body.year, req.body.month, req.body.date);
                }

                user.local.password = req.body.password;
                user.local.username = req.body.username;

                user.save(function (err, user) {
                    if (err){
                        var errorMessage = helper.displayMongooseError(err);
                        return res.send(500, errorMessage);
                    }

                    req.logIn(user, function(err){
                        if(err) return next(err);
                        return res.redirect('/'); // created -> login -> redirect to this page
                    });
                });
            }
        });
    });
};

exports.updateUser = function(req, res, next){
    console.log(JSON.stringify(req.params));
    return next();
}

exports.findOneUser = function(req, res, next){
    User.findOne({'_id':req.params.id}, function(err, user){
        if(err){
            console.log('**' + err);
            return next();
        }

        return res.send(user);
    });
}

exports.getConversation = function(req, res, next){
    var userId = req.query.userId;
    // get all conversations of this user
    Conversation.find({'participant.userId':userId})
        .sort({'lastUpdatedDate':-1})
        .limit(5).exec(function(err, conversation){
            if(err){
                console.log(err);
                return res.send(500, err);
            }

            if(conversation.length > 0){
                // make it's seen
                helper.makeConversationSeen(conversation,userId,function(err){
                    if(err) console.log(err);
                });
            }
            return res.send(200, conversation);
        });
}

exports.getRecentConversation = function(req, res, next){
    var userId = req.params.userId;
    // get latest conversation
    Conversation.find({'participant.userId':userId})
        .sort({'lastUpdatedDate':-1})
        .limit(1).exec(function(err, conversation){
            if(err){
                console.log(err);
                return res.send(500, err);
            }

            if(conversation){
                console.log('conversation: ' + JSON.stringify(conversation[0]));
                return res.send(200, conversation[0]);
            }
            return res.send(200, {});
    });
}

exports.getChatLog = function(req, res, next){
    var userId = req.params.userId;
    // it's from jquery tokeninput and it's a string
    // split it with ,
    var participant = req.body.participant.split(',');
    // parse string array to objectId array
    for(var i=0;i<participant.length;i++){
        var participantStr = participant[i];
        participant[i] = new ObjectId(participantStr);
    }
    // execute
    var query = {'participant.userId':{$all:participant},'participant':{$size:participant.length + 1}};
    // get this chat log
    // db.test.find({'user.name':{$all:['usera','userb']},user:{$size:2}})
    Conversation.findOne(query,function(err,conversation){
        if(err){
            console.log(err);
            return res.send(500, err);
        }

        return res.send(200, conversation);
    });
}

exports.updateConversation = function(req, res, next){
    var id = req.params.id;
    var content = req.body.content;
    var newMessage = content[content.length - 1];
    var senderId = newMessage.sender.userId;
    // find the conversation
    Conversation.findOne({'_id':id},function(err,conversation){
        if(err) return res.send(500, {error:err});

        // update now
        newMessage.createDate = new Date();
        conversation.lastUpdatedDate = newMessage.createDate;
        // update is read for participant
        for(var i=0;i<conversation.participant.length;i++){
            if(conversation.participant[i].userId == senderId){
                conversation.participant[i].isRead = true;
                conversation.participant[i].isSeen = true;
            }else{
                conversation.participant[i].isRead = false;
                conversation.participant[i].isSeen = false;
            }
        }
        conversation.content.push(newMessage);
        // update to database
        return conversation.save(function(err, conversation){
            if(err) return res.send(500, {error:err});

            return res.send(200, conversation);
        });
    });
}

exports.createConversation = function(req, res, next){
    var message = req.body.message;
    // it's from jquery tokeninput and it's a string
    // split it with ,
    var participant = req.body.participant;
    if(!Array.isArray(participant)){
        participant = participant.split(',');
    }else{
        var temp = [];
        for(var i=0;i<participant.length;i++){
            temp.push(participant[i].userId);
        }
        participant = temp;
    }
    helper.getUserFromTokenInput(participant,null,function(err, participant){
        if(err){
            return res.send(500, {error: err});
        }
        // init object before save
        var conversation = new Conversation();
        conversation.content = []; // init content
        // init an embedded document in content
        var temp = {};
        temp.message = message;
        temp.sender = {}; // init sender
        temp.sender.userId = req.session.passport.user.id;
        temp.sender.username = req.session.passport.user.username;
        temp.sender.avatar = req.session.passport.user.avatar;
        // then, add to content
        conversation.content.push(temp);
        // init participant object
        conversation.participant = [];
        for(var i=0;i<participant.length;i++){
            var input = participant[i];
            // init an embedded document in participant
            var temp = {};
            temp.userId = input.userId;
            temp.username = input.username;
            temp.avatar = input.avatar;
            // then, add to participant
            conversation.participant.push(temp);
        }
        // add current user into participant
        var temp = {};
        temp.userId = req.session.passport.user.id;
        temp.username = req.session.passport.user.username;
        temp.avatar = req.session.passport.user.avatar;
        temp.isRead = true;
        temp.isSeen = true;
        conversation.participant.push(temp);
        // save to database
        conversation.save(function(err, conversation){
            if(err){
                return res.send(500, {error: err});
            }

            return res.send(200, conversation);
        });
    });
}

exports.getConversationById = function(req, res, next){
    Conversation.findOne({'_id':req.params.id},function(err,conversation){
        if(err){
            console.log(err);
            return res.send(500, err);
        }
        return res.send(200, conversation);
    });
}