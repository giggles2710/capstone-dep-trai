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
    , UserToken = require("../../models/userToken")
    , Conversation = require("../../models/conversation")
    , helper = require("../../../helper/helper")
    , mailHelper = require("../../../helper/mailHelper")
    , validator = require("../../../helper/userValidator");

exports.changeUserPassword = function(req, res, next){
    var password = req.body.password,
        userId = req.params.id,
        tokenId = req.body.token;

    console.log('user id ' + userId + ' password '+password + ' token '+tokenId);

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

                    console.log('hello 4');
                    if(token){
                        console.log('hello 5');
                        // remove it
                        token.remove(function(err){
                            if(err)
                                return res.send(500, err);

                            console.log('hello 6');
                            return res.send(200, 'reseted');
                        });
                    }else{
                        console.log('hello 7');
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

        console.log('im here 1 ' + JSON.stringify(user));
        if(user){
            console.log('im here 2');
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
            console.log('im here 3');
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
    if(req.session.passport.user){
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
                    return res.send(400);
                }else{
                    // update user
                    req.session.passport.user.id = user._id;
                    req.session.passport.user.username = user.local.username;
                    req.session.passport.user.fullName = user.fullName;
                    req.session.passport.user.avatar = user.avatar;
                    return res.send(200, {
                        id:req.session.passport.user.id,
                        username: req.session.passport.user.username,
                        fullName: req.session.passport.user.fullName,
                        avatar: req.session.passport.user.avatar
                    });
                }
            }else{
                req.logout();
                return res.send(400);
            }
        })
    }else{
        return res.send(400);
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
    console.log('im here 1');
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

    console.log('target: ' + str +' type: '+type+' query: '+JSON.stringify(query));
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
    console.log(':::' + JSON.stringify(req.body));

    User.findOne({$or:[
        {'facebook.email':req.body.email},
        {'email':req.body.email}]
    },function(err, user){
        if(err) return res.send(500, "Something wrong happened. Please try again.");


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
            user.birthday = new Date(req.body.year, req.body.month, req.body.date);

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
                birthday: new Date(req.body.year, req.body.month, req.body.date),
                gender: req.body.gender,
                provider: "local"
            });

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

exports.getRecentConversation = function(req, res, next){
    var userId = req.params.userId;
    // get latest conversation
    Conversation.find({'participant.userId':userId})
        .sort({'lastUpdatedDate':-1})
        .limit(1, function(err, conversation){
            if(err){
                return res.send(500, err);
            }

            if(conversation){
                return res.send(200, conversation);
            }
    });
}

exports.getChatLog = function(req, res, next){
    var userId = req.params.userId;
    var participant = req.body.participant;
    // get this chat log
    // db.test.find({'user.name':{$all:['usera','userb']},user:{$size:2}})
    Conversation.find({'participant':{$all:participant},user:{$size:participant.length}},function(err,conversation){
        if(err) return res.send(500, err);

        return res.send(200, conversation);
    });
}

exports.updateConversation = function(req, res, next){
    var id = req.params.conversationId;
    var content = req.body.content;
    var newMessage = content[content.length - 1];
    Conversation.findOne({'_id':id},function(err,conversation){
        if(err) return res.send(500,err);

        // update now
        newMessage.createDate = new Date();
        conversation.lastUpdatedDate = new Date();

        conversation.content.push(newMessage);
        return conversation.save(function(err, conversation){
            if(err) return res.send(500, err);

            return res.send(200, conversation);
        });
    });
}