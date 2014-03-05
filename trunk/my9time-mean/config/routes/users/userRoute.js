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
    app.get('/api/checkSession', authenticationCtrl.checkSession);
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

                return res.send(200, {username:user.local.username, id: user._id, fullName: user.fullName});
            });
        })(req, res, next);
    });

    /**
     * TrungNM　- Get User Profile
     */
    app.get('/api/profile/:id', userController.viewProfile);

    /**
     * TrungNM　- Edit Profile
     */
    app.put('/api/users/edit/:id', userController.editProfile);

    /**
     * TrungNM　- Avatar Upload
     */
    app.post('/api/users/uploadAvatar', userController.uploadCropAvatar);


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
    app.put('/api/confirmFriendRequest', friendCtrl.confirmRequest);
    /**
     * thuannh
     * unfriend
     */
    app.put('/api/unfriend', friendCtrl.unfriend);
    /**
     * thuannh
     * get all friends
     */
    app.get('/api/getFriendToken/:userId/:eventId', friendCtrl.getAllFriendToInvite);
    /**
     * thuannh
     * init database from db.json
     */
    app.get('/api/init',userController.initUser);
    /**
     * thuannh
     * destroy all users
     */
    app.get('/api/destroy',userController.destroyUser);
    /**
     * thuannh
     * check friend status
     */
    app.get('/api/checkFriendStatus/:friendId',  friendCtrl.checkFriendStatus);
    /**
     * thuannh
     * get all friends of user
     */
    app.get('/api/getAllFriends/:userId', friendCtrl.getAllFriend);
    /**
     * thuannh
     * get the latest conversation of this user
     */
    app.get('/api/getRecentChat/:userId', authenticationCtrl.getRecentConversation);
    /**
     * thuannh
     * get the specific chat log
     */
    app.put('/api/getChatLog/:userId', authenticationCtrl.getChatLog);
    /**
     * thuannh
     * reply
     */
    app.put('/api/conversation/:id', authenticationCtrl.updateConversation);
    /**
     * thuannh
     * create a conversation
     */
    app.post('/api/conversation', authenticationCtrl.createConversation);
    /**
     * thuannh
     * get all conversation of user
     */
    app.get('/api/conversation', authenticationCtrl.getConversation);
    /**
     * thuannh
     * get conversation by id
     */
    app.get('/api/conversation/:id', authenticationCtrl.getConversationById);
    /**
     * thuannh
     * get all notifications
     */
    app.get('/api/notifications',friendCtrl.getAllNotifications);
    /**
     * thuannh
     * get all friend requests
     */
    app.get('/api/friendRequest',friendCtrl.getAllFriendRequest);
    /**
     * thuannh
     * get all event requests
     */
    app.get('/api/eventRequest',friendCtrl.getAllEventRequest);
    /**
     * thuannh
     * get all notifications unread count
     */
    app.get('/api/notificationUnreadCount/:userId',friendCtrl.countUnreadNotification);
    /**
     * thuannh
     * get all friend requests unread count
     */
    app.get('/api/friendRequestUnreadCount/:userId',friendCtrl.countUnreadFriendRequest);
    /**
     * thuannh
     * get all event requests unread count
     */
    app.get('/api/eventRequestUnreadCount/:userId',friendCtrl.countUnreadEventRequest);
    /**
     * thuannh
     * get all event requests unread count
     */
    app.get('/api/messageUnreadCount/:userId',friendCtrl.countMessageUnread);
    /**
     * minhtn
     * add todo
     */
    app.post('/api/users/addTodo', userController.addTodo);
    /**
     * minhtn
     * delete todo
     */
    app.post('/api/users/removeTodo', userController.removeTodo);
    /**
     * minhtn
     * change status todo
     */
    app.post('/api/users/changeStatusTodo', userController.changeStatusTodo);
    /**
     * NghiaNV- 5/3/2014
     * change language
     */
    app.post('/api/users/changeLanguage', userController.changeLanguage);
}

