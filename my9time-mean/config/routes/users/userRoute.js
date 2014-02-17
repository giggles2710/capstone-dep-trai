/**
 * Created by Noir on 1/17/14.
 */

var authenticationCtrl = require('../../../app/controllers/users/authCtrl'),
    friendCtrl = require('../../../app/controllers/users/friendCtrl');
var userController = require('../../../app/controllers/users/userController');


module.exports = function(app, passport){
    /**
     * thuannh
     * check session
     */
    app.get('/api/checkSession/:isFirstTime', authenticationCtrl.checkSession);
    /**
     * thuannh
     * route process for login
     */
    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                return res.send(401, info);
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }

                return res.send(200, {username:user.local.username, id: user._id});
            });
        })(req, res, next);
    });

    /**
     * TrungNM
     * Get All User
     */
//    app.get('/api/users', authenticationCtrl.getAllUsers);

    /**
     * TrungNM　- Get User Profile
     */
    app.get('/api/profile/:id', userController.viewProfile);

    /**
     * TrungNM　- Avatar Upload
     */
    app.post('/api/users/uploadAvatar', userController.uploadAvatar);

    /**
     * thuannh
     * create a new user account
     */
    app.post('/api/users', authenticationCtrl.signup);
    /**
     * thuannh
     * find user - take one
     */
    app.get('/api/users/:id', authenticationCtrl.findOneUser);
    /**
     * thuannh
     * update user
     */
    app.put('/api/users/:id', authenticationCtrl.updateUser);
    /**
     * thuannh
     * check unique for email or username
     */
    app.post('/api/checkUnique', authenticationCtrl.checkUnique);
    /**
     * thuannh
     * send recovery email
     */
    app.get('/api/sendRecoveryEmail/:username/:email', authenticationCtrl.checkRecoveryEmail);
    /**
     * thuannh
     * check recovery token
     */
    app.get('/api/checkRecoveryToken/:token', authenticationCtrl.checkRecoveryToken);
    /**
     * change password
     */
    app.put('/api/changePassword/:id', authenticationCtrl.changeUserPassword);
    /**
     * thuannh
     * facebook authenticate
     */
    app.get('/auth/facebook', passport.authenticate('facebook',{
        scope: ['email','user_about_me'],
        failureRedirect: '/login'
    }), function(req, res){
        res.redirect('/');
    });
    /**
     * thuannh
     * facebook callback authenticate
     */
    app.get('/auth/facebook/callback', passport.authenticate('facebook',{
        failureRedirect: '/login'
    }), function(req, res){
        res.redirect('/');
    });
    /**
     * thuannh
     * google authenticate
     */
    app.get('/auth/google', passport.authenticate('google',{
        failureRedirect: '/login'
    }),function(req, res){
        res.redirect('/');
    });
    /**
     * thuannh
     * google callback authenticate
     */
    app.get('/auth/google/callback', passport.authenticate('google',{
        failureRedirect: '/login'
    }),function(req, res){
        res.redirect('/');
    });
    /**
     * thuannh
     * log out
     */
    app.get('/logout', authenticationCtrl.logout);
    /**
     * thuannh
     * add friend
     */
    app.put('/api/addFriend', friendCtrl.addFriend);
    /**
     * thuannh
     * cancel friend request
     */
    app.put('/api/cancelRequest', friendCtrl.cancelRequest);
    /**
     * thuannh
     * add friend
     */
    app.put('/api/confirmRequest', friendCtrl.confirmRequest);
    /**
     * thuannh
     * add friend
     */
    app.put('/api/unfriend', friendCtrl.unfriend);

}

