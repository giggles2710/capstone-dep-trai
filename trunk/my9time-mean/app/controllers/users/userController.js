/**
 * Created by ConMeoMauDen on 11/02/2014.
 */

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
    , helper = require("../../../helper/helper")
    , mailHelper = require("../../../helper/mailHelper")
    , validator = require("../../../helper/userValidator")
    , fs = require('fs')
    , fsx = require('fs-extra')
    , im = require('imagemagick');

//Khu vuc cua Minh o duoi
exports.addTodo = function(req, res){
    var content = req.body.content;
    var updates = {
        $push: {todoList: {'content': content,
            'status': false
        }}
    };
    User.findOne({'_id': req.session.passport.user.id}, function (err, user) {
        user.update(updates, function (err) {
            if (err) return console.log('Error');
            console.log('Thnsffds');
        })
    });





//    User.update({_id: req.session.passport.user}, updates, function (err, user) {
//        if (err){console.log(err)};
////        return res.send(200);
//    });
};
exports.removeTodo = function(req,res){
    console.log(JSON.stringify(req.body.todo));
    User.update({'_id': req.session.passport.user.id},
        {
            $pull: {
                todoList: {_id: req.body.todo._id}

            }
        }, function (err, user) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something Wrong !')
            }
        }  )
};

exports.changeStatusTodo = function(req, res){
    var updates = '';
    if (req.body.todo.status == true){
        updates = {
            $set: {'todoList.$.status': false}
        };
    } else {
        updates = {
            $set: {'todoList.$.status': true}
        };
    }
//Khu vuc cua minh o tren

    User.update({'todoList._id': req.body.todo._id},updates, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something Wrong !')
        }
        console.log("BOOOO");
    }  )

};


exports.listall = function(){
    User.findOne({'_id':userId},function(err, user){

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
    var isFirstTime = req.params.isFirstTime;
    if(req.session.passport.user){
        // is authenticated
        // then check user is available or not
        if(!isFirstTime){
            // check user is available or not
            User.findOne({'_id':req.session.passport.user.id},function(err, user){
                if(err){
                    return next();
                }

                if(user){
                    if(user.isLocked){
                        // user is locked
                        req.logout();
                        return res.send(400);
                    }else{
                        return res.send(200, {id:req.session.passport.user.id, username: req.session.passport.user.username});
                    }
                }else{
                    req.logout();
                    return res.send(400);
                }
            })
        }else{
            return res.send(200, {id:req.session.passport.user.id, username: req.session.passport.user.username});
        }
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
            user.birthday = new Date(req.body.year, req.body.month, req.body.date)

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

exports.initUser = function(req, res, next){
    fsx.readFile('../db.json','utf-8',function(err, rawMenu){
        if(err)
            console.log("** Read file error: " + err);
        else{
            var data = JSON.parse(rawMenu);
            for(var i=0;i<data.length;i++){
                // user.birthday = new Date(req.body.year, req.body.month, req.body.date);
                var birthday = new Date(data[i].year, data[i].month, data[i].date);
                new User({
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    birthday: birthday,
                    'local.username': data[i].username,
                    'local.password': data[i].password,
                    gender: data[i].gender,
                    provider: data[i].provider,
                    email:data[i].email
                }).save(function(err){
                        if(err){
                            console.log("** " + err);
                            res.send('ERR');
                        }
                    });
            }
            console.log('Init done...');
            User.find(function(err, users){
                if(!err)
                    res.send(users);
            });
        }
    });
}

exports.destroyUser = function(req, res, next){
    User.remove({},function(err){
        if(err) return console.log(err);

        return res.redirect('/');
    });
}



/**
 * TrungNM - View Profile of User
 * URL: 'api/profile'
 */
exports.viewProfile = function(req, res, next){
    User.findOne({'_id':req.session.passport.user.id}, function(err, user){
        // Nếu có lỗi
        if(err){
            return next();
        }
        // Nếu thành công
        return res.send(user);
    });
}

/**
 * TrungNM - Edit Profile
 * URL: 'api/users/edit'
 */
exports.editProfile = function(req, res, next){
    User.findOne({'_id':req.session.passport.user.id}, function(err, user){
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.birthday = new Date(req.body.year, req.body.month, req.body.date);
        user.gender = req.body.gender;
        user.email = req.body.email;

        user.save(function (err, user) {
            if (err){
                var errorMessage = helper.displayMongooseError(err);
                return res.send(500, errorMessage);
            }

            req.logIn(user, function(err){
                if(err) return next(err);
                // TODO: Coi lai code Rdrect PUT --> GET
                return res.redirect('profile');
            });
        });

    });



}

/**
 * TrungNM - Delete User
 * URL: 'api/users/delete/:id'
 */
exports.deleteUser = function(req, res, next){
    var id = req.params.userID;
    console.log('Delete user:  ' + id);
    User.remove({'_id' : id}, function(err, user){
        // Nếu có lỗi
        if(err){
            return next();
        }
        // Nếu thành công
        return res.redirect('/profile');
    });
}

/**
 * TrungNM - Upload Avatar
 * URL: 'api/users/uploadAvatar'
 */
exports.uploadAvatar = function(req, res, next){
    console.log('REQ:   ' + JSON.stringify(req.body));

//    if (!req.files.file.name) {
//        console.log("There was an error")
//        res.redirect('profile');
//    }
//    // Resize avatar to 150x150
//    console.log('Flag 1');
//    im.resize({
//        srcPath: req.files.file.path,
//        dstPath: './public/img/avatar/' + req.session.passport.user.id + '.png',
//        width: 150,
//        height: 150
//    }, function (err, stdout, stderr) {
//        // TODO: Hiển thị thông báo lỗi Upload File type error, Ảnh GIF đc thì VIP
//        if (err) {
//            console.log('File Type Error !');
//            res.redirect('profile');
//        }
//
//        console.log('Flag 2');
//
//
//        // Successfully
//        // Set User avatar link - Save to database
//        var avatar = '/img/avatar/' + req.session.passport.user.id + '.png';
//        var updates = {
//            $set: {'avatar': avatar}
//        };
//        User.findOne({'_id': req.session.passport.user.id}, function (err, user) {
//            user.update(updates, function (err) {
//                if (err) return console.log('Error');
//            })
//        });
//
//        // Delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
////        fs.unlink(req.files.file.path, function () {
////            if (err) throw err;
////        });
//
//        // TODO: Code để tự load lại avatar
//        res.send(200);
//    });

}





//    User.authenticate(req.body.username, req.body.password, function(err, user, reason){
//        if(err)
//            return res.render('users/login',{message:'Something wrong happened '+err, title:'Log In', error: true});
//
//        if(user){
//            // login success
//            req.session.user = {
//                id: user.get('id'),
//                fullName: user.get('fullName'),
//                provider: user.get('provider')
//            };
//
//            return res.redirect('/profile');
//        }
//
//        // otherwise we can determine why we failed
//        var reasons = User.failedLogin;
//
//        if(reason == reasons.INPUT_REQUIRED){
//            return res.send(500,{errors:{name:'Enter your username/password'}});
//        }else if(reason==reasons.MAX_ATTEMPTS){
//            return res.send(500,{errors:{name:'Your account is locked. Please try again after 2 hours'}});
//        }else{
//            return res.send(500,{errors:{name:'The username or password you entered is incorrect'}});
//        }
//    });

//module.exports = function(app, passport) {
//    // =================================================================================
//    // POST: /login
//    app.post('/api/login', function(req, res){
//        User.authenticate(req.body.username, req.body.password, function(err, user, reason){
//            if(err)
//                return res.render('users/login',{message:'Something wrong happened '+err, title:'Log In', error: true});
//
//            if(user){
//                // login success
//                req.session.user = {
//                    id: user.get('id'),
//                    fullName: user.get('fullName'),
//                    provider: user.get('provider')
//                };
//
//                return res.redirect('/profile');
//            }
//
//            // otherwise we can determine why we failed
//            var reasons = User.failedLogin;
//
//            if(reason == reasons.INPUT_REQUIRED){
//                return res.send(500,{errors:{name:'Enter your username/password'}});
//            }else if(reason==reasons.MAX_ATTEMPTS){
//                return res.send(500,{errors:{name:'Your account is locked. Please try again after 2 hours'}});
//            }else{
//                return res.send(500,{errors:{name:'The username or password you entered is incorrect'}});
//            }
//        });
//    });
//    // =================================================================================
//    // GET: /auth/facebook/callback - callback facebook login
//    app.get('/auth/facebook/callback', passport.authenticate('facebook'),
//        function(req, res){
//            // authenticated
//            req.session.user = {
//                id: req.user._id,
//                fullName: req.user.fullName,
//                provider: 'facebook'
//            };
//            res.redirect('/profile');
//        });
//    // =================================================================================
//    // GET: /auth/google/callback - callback google login
//    app.get('/auth/google/callback', passport.authenticate('google'),
//        function(req, res){
//            // authenticated
//            req.session.user = {
//                id: req.user._id,
//                fullName: req.user.fullName,
//                provider: "google"
//            };
//            res.redirect('/profile')
//        });
//    // =================================================================================
//    // POST: /signup - Registration

//
//    // =================================================================================
//    // GET: /logout
//    // log out

//
//    // =================================================================================
//    // GET: recovery/checkContact - forgot the password
//    app.get('/recovery', function(req, res){
//        return res.render('users/checkUsername',{title: 'Forgot Account',message:''});
//    });
//
//    // =================================================================================
//    // POST: recovery/checkUsername
//    app.post('/recovery/checkUsername', function(req, res){
//        // find user with this username
//        User.findOne({'local.username':req.body.username}, function(err, user){
//            if(err)
//                return res.render('users/checkUsername',
//                    {
//                        title:'Forgot Account',
//                        message:'Something wrong happened. Please try again.'
//                    }); // if any error occurs, render this
//
//            if(user){
//                // if this users is exist, pass user id along and render step 2
//                return res.render('users/checkContact',
//                    {
//                        title:'Forgot Account',
//                        userID: user._id,
//                        message: ''
//                    });
//            }else{
//                // if this username is not correct, display error message.
//                return res.render('users/checkUsername',
//                    {
//                        title:'Forgot Account',
//                        message: 'Wrong username. Please input correct username.'
//                    });
//            }
//        });
//    });
//
//    // =================================================================================
//    // POST: recovery/checkContact
//    app.post('/recovery/checkContact', function(req, res){
//        // check this email if it's belong to this user
//        // mongodb query: db.users.find({email:1.99, $or: [ { qty: { $lt: 20 } }, { sale: true } ] } )
//        User.findOne({'_id':req.body.userID,'email':req.body.email}, function(err, user){
//            if(err)
//                return res.render('users/checkContact',
//                    {
//                        title:'Forgot Account',
//                        userID: req.body.userID,
//                        message:'Something wrong happened. Please try again.'
//                    }); // if any error occurs, render this
//
//            if(user){
//                // user is match
//                // create a token
//                var userToken = new UserToken({
//                    userId:user._id,
//                    token: ''
//                });
//
//                userToken.save(function(err, userToken){
//                    if(err) return res.render('users/checkContact',
//                        {
//                            title: 'Forgot Account',
//                            userID: user._id,
//                            message: 'Something wrong happened. Please try again.'
//                        });
//                    var resetUrl = 'http://localhost:8080/resetPassword/' + userToken.token + '';
//                    // send a mail to their email and render success page
//                    mailHelper.sendResetPasswordMail(user.email, resetUrl, userToken.createDate, function(err, responseStatus, http, text){
//                        if(err) return console.log(err);
//                    });
//                });
//
//                return res.render('users/resetPasswordSuccess',{
//                    title: 'Forgot Account',
//                    message: ''
//                });
//            }else{
//                // user and email is not a match
//                // display an error message
//                return res.render('users/checkContact',
//                    {
//                        title: 'Forgot Account',
//                        userID: req.body.userID,
//                        message: 'This is not your email address. Please enter the email address you registered to us.'
//                    });
//            }
//        });
//    });
//
//    // ===============================================================================================
//    // GET: /resetPassword/:token
//
//    app.get('/resetPassword/:token',function(req, res){
//        // check token is valid
//        var token = req.params.token;
//        console.log('token: ' + token);
//        var title = 'Reset password';
//        UserToken.findOne({'token':token},function(err, userToken){
//            if(err) return res.render('users/resetPassword',
//                {
//                    title: title,
//                    message: 'Something wrong just happened. Please try again!',
//                    requestBack: false,
//                    messageForm: '',
//                    userId: '',
//                    tokenId: ''
//                });
//
//            // found this token
//            if(userToken){
//                // check if this userToken is expires or not
//                if(userToken.expires < Date.now()) return res.render('users/resetPassword',
//                    {
//                        title: title,
//                        message: 'Your request is expired.',
//                        requestBack: true,
//                        messageForm: '',
//                        userId: '',
//                        tokenId: ''
//                    });
//                // this still is available
//                // reset password and render page to user input new password
//
//                console.log('user token: ' + userToken._id + ' userId: ' + userToken.userId);
//
//                return res.render('users/resetPassword',
//                    {
//                        title: title,
//                        message: '',
//                        requestBack:false,
//                        messageForm: '',
//                        userId: userToken.userId,
//                        tokenId: userToken._id
//                    });
//            }else{
//                return res.send(404);
//            }
//        });
//    });
//
//    // ===============================================================================================
//    // POST: /resetPassword/:token
//
//    app.post('/resetPassword',function(req, res){
//        var password = req.body.password,
//            passwordConfirm = req.body.passwordConfirm,
//            userId = req.body.userId,
//            tokenId = req.body.tokenId,
//            title = "Reset password";
//
//        console.log('id: ' + userId);
//
//        if(!password && !passwordConfirm){
//            return res.render("users/resetPassword",
//                {
//                    title:title,
//                    message:'',
//                    requestBack:false,
//                    messageForm:'Please input fields.',
//                    userId:userId,
//                    tokenId: tokenId
//                });
//        }
//        if(!(password === passwordConfirm)){
//            return res.render("users/resetPassword",
//                {
//                    title:title,
//                    message:'',
//                    requestBack:false,
//                    messageForm:'Password confirm is not match.',
//                    userId: userId,
//                    tokenId: tokenId
//                });
//        }
//        // update password
//        User.findOne({'_id':userId},function(err, user){
//            if(err) return res.render('users/resetPassword',
//                {
//                    title:title,
//                    message:'',
//                    requestBack:false,
//                    messageForm:'Something wrong happened. Try again!',
//                    userId: userId,
//                    tokenId: tokenId
//                });
//
//            console.log('user: '+user);
//
//            if(user){
//                // found user
//                // update their password
//                user.local.password = password;
//
//                user.save(function(err){
//                    if(err) return console.log(err);
//
//                    // update password ok
//                    // remove user token
//                    UserToken.findOne({'_id':tokenId},function(err, token){
//                        if(err) return console.log(err);
//
//                        if(token){
//                            // remove it
//                            token.remove(function(err){
//                                if(err) return console.log('Can not delete token ' + tokenId);
//                            });
//                        }else{
//                            // log
//                            return console.log('Can not find token ' + tokenId);
//                        }
//                    })
//
//                    return res.render('users/finishResetPassword',
//                        {
//                            title:'Reset password successfully'
//                        });
//                });
//            }else{
//                return res.render('users/resetPassword',
//                    {
//                        title:title,
//                        message:'',
//                        requestBack:false,
//                        messageForm:'This user is no longer available.',
//                        userId:userId,
//                        tokenId: tokenId
//                    });
//            }
//        });
//    });
//

//}
//
