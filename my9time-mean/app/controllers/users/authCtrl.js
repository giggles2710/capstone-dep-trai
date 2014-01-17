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
    , validator = require("../../../helper/userValidator");


/**
 * update user
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateUser = function(req, res, next){

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
            return res.send(200, true);
        }else{
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
        res.redirect('/');
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
