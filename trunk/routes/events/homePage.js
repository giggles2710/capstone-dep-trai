/**
 * Created by Nova on 1/2/14.
 */
var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , eventDetail = require(path.join(HOME + "/models/eventDetail"))
    , helper = require(path.join(HOME + "/helpers/event.Helper"))
    , User = require(path.join(HOME + "/models/user"));


module.exports = function (app) {

//==============================================================================================
// get all event relate to current User
    app.get('/myniti', function (req, res) {
        var currentUser = req.session.user;
        if (currentUser) {
            User.findOne({'_id': currentUser.id}, function (err, user) {
                // Get User's friend list from Database
                if (err) return console.log(err);
                else {
                    // get all friends
                    var friendList = new Array();
                    friendList.push(currentUser.id);
                    console.log("1-FriendID: " + friendList[0]);
                    for (var i = 1; i < user.friend.length; i++) {
                        var tmp = user.friend[i];
                        if (tmp.isConfirmed) {
                            friendList[i] = tmp.userID;
                            console.log("2-FriendID: " + friendList[i]);
                        }
                    }
                    //get events of all friends
                    for (var i = 0; i < friendList.length; i++) {
                        //  lấy ra cái event mà : event đó ở chế độ close community hoặc open.Và bạn mình là người tham gia ở dạng member hoặc ask to join,
                        //  hoặc bạn mình là người tạo.
                        console.log("3-FriendID: " + friendList[i]);
                        eventDetail.find({ $and: [
                                {'privacy': {$in: ['c', 'o']}},
                                {$or: [
                                    {$and: [
                                        {'user.userID': friendList[i]},
                                        {'user.status': {$in: ['m', 'a']}}
                                    ]},
                                    {'creator.userID': friendList[i]}
                                ]}
                            ]}, {sort: [
                                ['lastUpdated']
                            ]},//.sort({'lastUpdated': -1}).limit(2),//TODO : đang test

                            function (err, event) {
                                if (err) return console.log("Không tìm được");
                                else {
                                    console.log(event);
                                    res.render('event/home', {events: event});

                                }

                            })
                    }


                }
            });
        } else {
            return res.redirect('/login');
        }


    });

//==========================================================================================
// For Post AJAX
    app.post('/myniti', function (req, res) {
        var count = req.body.count;
        var currentUser = req.session.user;
        if (currentUser) {
            User.findOne({'_id': currentUser.id}, function (err, user) {
                // Get User's friend list from Database
                if (err) return console.log(err);
                else {
                    // get all friends
                    var friendList = new Array();
                    for (var i = 0; i < user.friend.length; i++) {
                        var tmp = user.friend[i];
                        if (tmp.isConfirmed) {
                            friendList[i] = tmp.user;
                        }
                    }
                    friendList.push(currentUser.id);

                    //get events of all friends
                    for (var i = 0; i < friendList.length; i++) {
                        //  lấy ra cái event mà : event đó ở chế độ close community hoặc open.Và bạn mình là người tham gia ở dạng member hoặc ask to join,
                        //  hoặc bạn mình là người tạo.
                        eventDetail.find({ $and: [
                                {'privacy': {$in: ['c', 'o']}},
                                {$or: [
                                    {$and: [
                                        {'user.userID': friendList[i]},
                                        {'user.status': {$in: ['m', 'a']}}
                                    ]},
                                    {'creator.userID': friendList[i]}
                                ]}
                            ]},//{sort:[['lastUpdated']]},//.sort({'lastUpdated': -1}).limit(2*count),//TODO : đang test nữa nè

                            function (err, event) {
                                if (err) return console.log("Không tìm được");
                                else {
                                    console.log(event);
                                    res.render('event/home', {events: event});

                                }

                            })
                    }


                }
            });
        } else {
            return res.redirect('/login');
        }


    });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Test AJAX like
    app.get('/like', function (req, res) {
        res.render('event/like');
    })

    //AJAX like
    app.post('/like', function (req, res) {
        var eventId = req.params.id;
        var userId = req.session.user.id;
        console.log("id:" + userId);
        var userName = req.session.user.fullName;
        // find event
        eventDetail.findOne({'_id': eventId}, function (err, event) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if (event) {
                // Check User has already liked or not
                for (var i = 0; i < event.like.length; i++) {
                    if (event.like[i].userID == userId) {
                        // user has already liked this event => unlike it
                        eventDetail.update({'_id': eventId}, {$pull: {like: {'userID': userId}}}, function (err) {
                            if (err) {
                                console.log(err);
                                return res.send(500, 'Sorry. You are not handsome enough to do this!');
                            }
                            return res.send(200, 'Unlike.');
                        });
                        break;
                    }
                    // user has not liked this => like it
                    else {
                        eventDetail.update({'_id': eventId}, {$push: {like: {'userID': userId, 'name': userName}}}, function (err) {
                            if (err) {
                                console.log(err);
                                return res.send(500, 'Sorry. You are not handsome enough to do this!');
                            }
                            return res.send(200, 'Like.');
                        });
                    }
                }


            }
        });
    });


}