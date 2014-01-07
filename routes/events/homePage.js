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
        var userID = currentUser.id;
        var friend = [];
        if (currentUser) {
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                    for (var i = 0; i < user.friend.length; i++) {
                        friend.push(user.friend[i].userId)
                        //console.log(user.friend[i].userId);
                    }
                    console.log('friend:' + friend);
                    // Tìm User và USer Friends --> array các ID

                    var findFriend = {$or: [
                        //lấy event của mình
                        {
                            $and: [
                                {'privacy': {$in: ['c', 'o' , 'g']}},
                                {$or: [
                                    {$and: [
                                        {'user.userID': userID},
                                        {'user.status': {$in: ['m', 'a']}}
                                    ]},
                                    {'creator.userID': userID}
                                ]}
                            ]
                        },
                        // lấy event của bạn
                        {
                            $and: [
                                {'privacy': {$in: ['c', 'o']}},
                                {$or: [
                                    {$and: [
                                        {'user.userID': {$in: friend}},
                                        {'user.status': {$in: ['m', 'a']}}
                                    ]},
                                    {'creator.userID': {$in: friend}}
                                ]}
                            ]
                        }
                    ]
                    }

                    eventDetail.find(findFriend, function (err, events) {
                        res.render('event/home', {title: user.fullName, events: events, user: user});
                    })


                }
            )
            ;
        }
    })

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
        console.log("UserID: " + userId);
        console.log("eventID: " + eventId);
        var userName = req.session.user.fullName;
        // find event
        eventDetail.findOne({'_id': eventId}, function (err, event) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if (event) {
                // Check User has already liked or not
                console.log('event:' + event);
                var flash = 1;
                for (var i = 0; i < event.like.length; i++) {
                    console.log('length:' + event.like.length);
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
                    else flash = 0;
                }
                // user has not liked this => like it
                if (flash == 0) {
                    eventDetail.update({'_id': eventId}, {$push: {like: {'userID': userId, 'name': userName}}}, function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(500, 'Sorry. You are not handsome enough to do this!');
                        }
                        return res.send(200, 'Like.');
                    });
                }


            }
        });
    });


}