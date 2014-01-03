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

var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , User = require(path.join(HOME + "/models/user"))
    , UserToken = require(path.join(HOME + "/models/userToken"))
    , helper = require(path.join(HOME + "/helpers/helper"))
    , mailHelper = require(path.join(HOME + "/helpers/mailHelper"))
    , validator = require(path.join(HOME + "/helpers/userValidator"));

module.exports = function(app, passport) {
    // =================================================================================
    // GET: /loginMenu
    app.get('/loginMenu', function(req, res){
        var title = 'Express';
        var isLoggedIn = false;
        if(req.session.user){
            title = req.session.user.fullName + " of " + req.session.user.provider;
            isLoggedIn = true;
        }
        return res.render('indexLoginTest', { title: title , isLoggedIn: isLoggedIn});
    });

    // =================================================================================
    // GET: /login
    app.get('/login', function(req, res){
        res.render('users/login', {title: 'Log In',message:'',error: false});
    });

    // =================================================================================
    // POST: /login
    app.post('/login', function(req, res){
        User.authenticate(req.body.username, req.body.password, function(err, user, reason){
            if(err)
                return res.render('users/login',{message:'Something wrong happened '+err, title:'Log In', error: true});

            if(user){
                // login success
                req.session.user = {
                    id: user.get('id'),
                    fullName: user.get('fullName'),
                    provider: user.get('provider')
                };

                return res.redirect('/profile');
            }

            // otherwise we can determine why we failed
            var reasons = User.failedLogin;

            if(reason == reasons.INPUT_REQUIRED){
                return res.render('users/login',{message:'Enter your username/password.', title: 'Log In', error: true});
            }else if(reason==reasons.MAX_ATTEMPTS){
                return res.render('users/login',{message:'Your account is locked. Please try again after 2 hours.', title:'Log In', error: true});
            }else{
                return res.render('users/login',{message:'The username or password you entered is incorrect.', title: 'Log In',error: true});
            }
        });
    });

    // =================================================================================
    // GET: /auth/facebook - get facebook login
    app.get('/auth/facebook', passport.authenticate('facebook',{scope: 'email'}));

    // =================================================================================
    // GET: /auth/facebook/callback - callback facebook login
    app.get('/auth/facebook/callback', passport.authenticate('facebook'),
        function(req, res){
            // authenticated
            req.session.user = {
                id: req.user._id,
                fullName: req.user.fullName,
                provider: 'facebook'
            };
            res.redirect('/profile');
        });

    // =================================================================================
    // GET: /auth/google - get google login
    app.get('/auth/google', passport.authenticate('google'));

    // =================================================================================
    // GET: /auth/google/callback - callback google login
    app.get('/auth/google/callback', passport.authenticate('google'),
        function(req, res){
            // authenticated
            req.session.user = {
                id: req.user._id,
                fullName: req.user.fullName,
                provider: "google"
            };
            res.redirect('/profile')
        });

    // =================================================================================
    // GET: /signup - get registration form
    app.get('/signup', function(req, res){
        var models = {
            title: 'Register',
            dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            months: [1,2,3,4,5,6,7,8,9,10,11,12],
            years: []
        };

        models.years = validator.getAllYears();
        return res.render('users/signup',models);
    });

    // =================================================================================
    // POST: /signup - Registration
    app.post('/signup', function (req, res) {
        var validateMessage = validator.validate(req.body.firstName, req.body.lastName, req.body.username, req.body.email, req.body.password, req.body.confirmPassword, req.body.date, req.body.month, req.body.year, req.body.gender);
        if (validateMessage === '') {
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

                        req.session.user = {
                            id: user.get('id'),
                            fullName: user.get('fullName'),
                            provider: user.get('provider')
                        };

                        return res.send(200, 'OK');
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

                        req.session.user = {
                            id: user.get('id'),
                            fullName: user.get('fullName'),
                            provider: user.get('provider')
                        };

                        return res.send(200, 'OK');
                    });
                }
            });
        }else{
            res.send(500, validateMessage);
        }
    });

    // =================================================================================
    // GET: /logout
    // log out
    app.get('/logout', function(req, res){
        req.session.destroy();
        res.redirect('/login');
    });

    // =================================================================================
    // GET: recovery/checkContact - forgot the password
    app.get('/recovery', function(req, res){
        return res.render('users/checkUsername',{title: 'Forgot Account',message:''});
    });

    // =================================================================================
    // POST: recovery/checkUsername
    app.post('/recovery/checkUsername', function(req, res){
        // find user with this username
        User.findOne({'local.username':req.body.username}, function(err, user){
            if(err)
                return res.render('users/checkUsername',
                    {
                        title:'Forgot Account',
                        message:'Something wrong happened. Please try again.'
                    }); // if any error occurs, render this

            if(user){
                // if this users is exist, pass user id along and render step 2
                return res.render('users/checkContact',
                    {
                        title:'Forgot Account',
                        userID: user._id,
                        message: ''
                    });
            }else{
                // if this username is not correct, display error message.
                return res.render('users/checkUsername',
                    {
                        title:'Forgot Account',
                        message: 'Wrong username. Please input correct username.'
                    });
            }
        });
    });

    // =================================================================================
    // POST: recovery/checkContact
    app.post('/recovery/checkContact', function(req, res){
        // check this email if it's belong to this user
        // mongodb query: db.users.find({email:1.99, $or: [ { qty: { $lt: 20 } }, { sale: true } ] } )
        User.findOne({'_id':req.body.userID,'email':req.body.email}, function(err, user){
            if(err)
                return res.render('users/checkContact',
                    {
                        title:'Forgot Account',
                        userID: req.body.userID,
                        message:'Something wrong happened. Please try again.'
                    }); // if any error occurs, render this

            if(user){
                // user is match
                // create a token
                var userToken = new UserToken({
                    userId:user._id,
                    token: ''
                });

                userToken.save(function(err, userToken){
                    if(err) return res.render('users/checkContact',
                        {
                            title: 'Forgot Account',
                            userID: user._id,
                            message: 'Something wrong happened. Please try again.'
                        });
                    var resetUrl = 'http://localhost:8080/resetPassword/' + userToken.token + '';
                    // send a mail to their email and render success page
                    mailHelper.sendResetPasswordMail(user.email, resetUrl, userToken.createDate, function(err, responseStatus, http, text){
                        if(err) return console.log(err);
                    });
                });

                return res.render('users/resetPasswordSuccess',{
                    title: 'Forgot Account',
                    message: ''
                });
            }else{
                // user and email is not a match
                // display an error message
                return res.render('users/checkContact',
                    {
                        title: 'Forgot Account',
                        userID: req.body.userID,
                        message: 'This is not your email address. Please enter the email address you registered to us.'
                    });
            }
        });
    });

    // ===============================================================================================
    // GET: /resetPassword/:token

    app.get('/resetPassword/:token',function(req, res){
        // check token is valid
        var token = req.params.token;
        console.log('token: ' + token);
        var title = 'Reset password';
        UserToken.findOne({'token':token},function(err, userToken){
            if(err) return res.render('users/resetPassword',
                {
                    title: title,
                    message: 'Something wrong just happened. Please try again!',
                    requestBack: false,
                    messageForm: '',
                    userId: '',
                    tokenId: ''
                });

            // found this token
            if(userToken){
                // check if this userToken is expires or not
                if(userToken.expires < Date.now()) return res.render('users/resetPassword',
                    {
                        title: title,
                        message: 'Your request is expired.',
                        requestBack: true,
                        messageForm: '',
                        userId: '',
                        tokenId: ''
                    });
                // this still is available
                // reset password and render page to user input new password

                console.log('user token: ' + userToken._id + ' userId: ' + userToken.userId);

                return res.render('users/resetPassword',
                    {
                        title: title,
                        message: '',
                        requestBack:false,
                        messageForm: '',
                        userId: userToken.userId,
                        tokenId: userToken._id
                    });
            }else{
                return res.send(404);
            }
        });
    });

    // ===============================================================================================
    // POST: /resetPassword/:token

    app.post('/resetPassword',function(req, res){
        var password = req.body.password,
            passwordConfirm = req.body.passwordConfirm,
            userId = req.body.userId,
            tokenId = req.body.tokenId,
            title = "Reset password";

        console.log('id: ' + userId);

        if(!password && !passwordConfirm){
            return res.render("users/resetPassword",
                {
                    title:title,
                    message:'',
                    requestBack:false,
                    messageForm:'Please input fields.',
                    userId:userId,
                    tokenId: tokenId
                });
        }
        if(!(password === passwordConfirm)){
            return res.render("users/resetPassword",
                {
                    title:title,
                    message:'',
                    requestBack:false,
                    messageForm:'Password confirm is not match.',
                    userId: userId,
                    tokenId: tokenId
                });
        }
        // update password
        User.findOne({'_id':userId},function(err, user){
            if(err) return res.render('users/resetPassword',
                {
                    title:title,
                    message:'',
                    requestBack:false,
                    messageForm:'Something wrong happened. Try again!',
                    userId: userId,
                    tokenId: tokenId
                });

            console.log('user: '+user);

            if(user){
                // found user
                // update their password
                user.local.password = password;

                user.save(function(err){
                    if(err) return console.log(err);

                    // update password ok
                    // remove user token
                    UserToken.findOne({'_id':tokenId},function(err, token){
                        if(err) return console.log(err);

                        if(token){
                            // remove it
                            token.remove(function(err){
                                if(err) return console.log('Can not delete token ' + tokenId);
                            });
                        }else{
                            // log
                            return console.log('Can not find token ' + tokenId);
                        }
                    })

                    return res.render('users/finishResetPassword',
                        {
                            title:'Reset password successfully'
                        });
                });
            }else{
                return res.render('users/resetPassword',
                    {
                        title:title,
                        message:'',
                        requestBack:false,
                        messageForm:'This user is no longer available.',
                        userId:userId,
                        tokenId: tokenId
                    });
            }
        });
    });
}

