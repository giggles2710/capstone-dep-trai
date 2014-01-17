/**
 * Created by Noir on 1/17/14.
 */

var authenticationCtrl = require('../../../app/controllers/users/authCtrl');

module.exports = function(app, passport){

    app.get('/api/checkSession', function(req, res, next){
        if(req.session.passport.user){
            // is authenticated
            return res.send(200, {id:req.session.passport.user.id, username: req.session.passport.user.username});
        }else{
            return res.send(500);
        }
    });

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
    app.post('/users', authenticationCtrl.signup);

    /**
     * check unique
     */
    app.post('/api/checkUnique', authenticationCtrl.checkUnique);

    /**
     * log out
     */
    app.get('/logout', authenticationCtrl.logout);
}

