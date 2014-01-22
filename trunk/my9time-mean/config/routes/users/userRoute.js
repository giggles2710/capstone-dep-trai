/**
 * Created by Noir on 1/17/14.
 */

var authenticationCtrl = require('../../../app/controllers/users/authCtrl');

module.exports = function(app, passport){
    /**
     * check session
     *
     * thuannh added
     */
    app.get('/api/checkSession/:isFirstTime', authenticationCtrl.checkSession);
    /**
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
     * create a new user account
     */
    app.post('/api/users', authenticationCtrl.signup);
    /**
     * find user - take one
     */
    app.get('/api/users/:id', authenticationCtrl.findOneUser);
    /**
     * update user
     */
    app.put('/api/users/:id', authenticationCtrl.updateUser);
    /**
     * check unique
     */
    app.post('/api/checkUnique', authenticationCtrl.checkUnique);
    /**
     * send recovery email
     */
    app.get('/api/sendRecoveryEmail/:username/:email', authenticationCtrl.checkRecoveryEmail);
    /**
     * check recovery token
     */
    app.get('/api/checkRecoveryToken/:token', authenticationCtrl.checkRecoveryToken);
    /**
     * change password
     */
    app.put('/api/changePassword/:id', authenticationCtrl.changeUserPassword);
    /**
     * log out
     */
    app.get('/logout', authenticationCtrl.logout);
}

