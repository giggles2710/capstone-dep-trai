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
            console.log('Login:   ' + JSON.stringify(req.body));
            if (err) { return next(err) }
            if (!user) {
                return res.send(401, info);
            }

            if(user.local){
                // is user
                req.logIn(user, function(err) {
                    if (err) { return next(err); }

                    console.log('Server: login successfully:  ' + JSON.stringify(user));
                    return res.send(200, {username:user.usernameByProvider, id: user._id, fullName: user.fullName, avatar: user.avatarByProvider});
                });
            }else{
                // is admin
                req.logIn(user, function(err) {
                    if (err) { return next(err); }

                    return res.send(200, {username:user.username, id: user._id, isAdmin: true});
                });
            }

        })(req, res, next);
    });

    /**
     * TrungNM　- /api/phone/login
     */
    app.post('/api/phone/login', function(req, res, next) {

        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                return res.send(401, info);
            }

            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send(200, {username:user.usernameByProvider, id: user._id, fullName: user.fullName, avatar: user.avatarByProvider});
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
//    app.put('/api/users/edit/:id', userController.editProfile);
    app.put('/api/user/editProfile',userController.editProfile);

    /**
     * TrungNM　- Avatar Upload
     */
    app.post('/api/users/uploadAvatar', userController.uploadAvatar);

    /**
     * TrungNM　- Crop Avatar
     */
    app.post('/api/users/cropAvatar', userController.cropAvatar);

    /**
     * TrungNM　- Multiple File Upload
     */
    app.post('/api/users/multipleFileUpload', userController.multipleFileUpload);

    //TODO: Phone Test Routes
    /**
     * TrungNM　- Multiple File Upload
     */
    app.get('/phone/user', userController.phoneUser);

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
     * TrungNM - Code for Mobile
     * add friend
     */
    app.put('/mobile/addFriend', friendCtrl.addFriendMobile);
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
     * TrungNM - Code for Mobile
     * cancel friend request
     */
    app.put('/mobile/cancelRequest', friendCtrl.cancelRequestMobile);

    /**
     * thuannh
     * add friend
     */
    app.put('/api/confirmFriendRequest', friendCtrl.confirmRequest);
    /**
     * TrungNM - Code for Mobile
     * add friend
     */
    app.put('/mobile/confirmFriendRequest', friendCtrl.confirmRequestMobile);

    /**
     * thuannh
     * unfriend
     */
    app.put('/api/unfriend', friendCtrl.unfriend);
    /**
     * TrungNM - Code for Mobile
     * unfriend
     */
    app.put('/mobile/unfriend', friendCtrl.unfriendMobile);
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
     * TrungNM - Code for Mobile
     * check friend status
     */
    app.post('/mobile/checkFriendStatus',  friendCtrl.checkFriendStatusMobile);

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
     * get todo
     */
    app.get('/api/users/getTodolist/:id', userController.getTodo);

    /**
     * minhtn
     * add todo
     */
    app.post('/api/users/addTodo', userController.addTodo);

    /**
     * TrungNM - Add todos for Mobile
     */
    app.post('/mobile/users/addTodo', userController.addTodoMobile);

    /**
     * minhtn
     * delete todo
     */
    app.post('/api/users/removeTodo', userController.removeTodo);

    /**
     * TrungNM - Remove todos for Mobile
     */
    app.post('/mobile/users/removeTodo', userController.removeTodoMobile);

    /**
     * minhtn
     * change status todo
     */
    app.post('/api/users/changeStatusTodo', userController.changeStatusTodo);

    /**
     * TrungNM - Change Status todos for Mobile
     */
    app.post('/mobile/users/changeStatusTodo', userController.changeStatusTodoMobile);

    /**
     * NghiaNV- 5/3/2014
     * change language
     */
    app.post('/api/users/changeLanguage', userController.changeLanguage);
    /**
     * NghiaNV- 26/3/2014
     * ccheckIsNullProfile
     */
    app.post('/api/checkIsNullProfile',userController.checkIsNullProfile);
    /**
     * NghiaNV- 5/3/2014
     * get language
     */
    app.get('/api/users/getLanguage', userController.getLanguage);
    /**
     * NghiaNV- 25/3/2014
     * get language
     */
    app.get('/api/getCurProfile', userController.getCurProfile);
    /**
     * NghiaNV- 19/3/2014
     * get friendInfo
     */
    app.post('/api/getFriendInfo', userController.getFriendInfo);
    /**
     * NghiaNV- 22/3/2014
     * get Highlight List
     */
    app.post('/api/getHighlightList',userController.getHighlightList);
    /**
     * get recent chatters
     */
    app.get('/api/getRecentChatters/:userId',friendCtrl.getRecentChatters);
    /**
     * get friend requests for notification
     */
    app.get('/api/getFriendRequestForNotification/:userId',friendCtrl.getFriendRequestForNotification);
    /**
     * get event requests for notification
     */
    app.get('/api/getEventRequestForNotification/:userId',friendCtrl.getEventRequestForNotification);
    /**
     * thuannh
     * reject friend request
     *
     */
    app.put('/api/rejectFriendRequest',friendCtrl.rejectFriendRequest);
    /**
     * thuannh
     * get a list of id of event that related to this user
     */
    app.get('/api/getEventIdsForNoti',userController.getEventIdsForNoti);
    /**
     * thuannh
     * get all notifications
     */
    app.get('/api/notification',friendCtrl.getAllNotifications);
    /**
     * thuannh
     * make json format for the list of bad words from Google
     */
    app.get('/api/badword',userController.convertBadWordListToJson);
    /**
     * -----
     * Statistic
     */
    app.post('/api/getStatistic',userController.getStatistic);


    /**
     * TrungNM
     * Count todoList
     */
    app.post('/mobile/countTodo',userController.countTodo);

    /**
     * thuannh
     * get event to alarm
     */
    app.get('/api/getEventToAlarm',userController.getEventToAlarm);
    /**
     * thuannh
     * ger recommended friends
     */
    app.get('/api/getRecommendedFriends',userController.getRecommendedFriends);

}

