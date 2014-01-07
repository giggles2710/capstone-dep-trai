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
//                eventDetail.find( { $query: findFriend , $orderby: { 'lastUpdated': -1 }} ,function (err, events) {
//                    console.log(err);
//                        res.render('event/home', {title: user.fullName, events: events, user: user});
//                        console.log("event: " + events);
//                    });

                    eventDetail.find(findFriend).sort('-lastUpdated').limit(2).exec(function (err, events) {
                        console.log(err);
                        res.render('event/home', {title: user.fullName, events: events, user: user});
                        console.log("event: " + events);
                    });

                }
            )
        }
    })



//==========================================================================================
// For Post AJAX
    app.post('/myniti', function (req, res) {
        var count = req.body.count;
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

                    eventDetail.find(findFriend).sort('-lastUpdated').limit(2).skip(2*count).exec(function (err, events) {
                        console.log(err);
                        res.render('event/home', {title: user.fullName, events: events, user: user});
                        console.log("event: " + events);
                    });


                }
            )
        }

    });



//=================================================================================================================
    //Test AJAX like
    app.get('/like', function (req, res) {
        res.render('event/like');
    })

    // POST AJAX like
    app.post('/like', function (req, res) {
        var eventId = req.body.id;
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
                console.log('like:' + event.like);
                console.log('length:' + event.like.length);

                // If chưa có ai like hết
                if(event.like.length == 0){
                    eventDetail.update({'_id': eventId}, {$push: {like: {'userID': userId, 'name': userName}}}, function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(500, 'Sorry. You are not handsome enough to do this!');
                        }
                        return res.send(200, 'Like.');
                    });
                }

                else{
                    var flash = 1;
                    for (var i = 0; i < event.like.length ; i++) {
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
                    console.log('flash: ' + flash);
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


            }
        });
    });



//====================================================================================================
    // AJAX share
    app.get('/share', function(req,res){
        res.render("/event/share");
    })

   // AJAX post share
    app.post('/share',function(req,res){
        var eventId = req.body.id;
        var userId = req.session.user.id;
        console.log("UserID: " + userId);
        console.log("eventID: " + eventId);
        // find event
        eventDetail.findOne({'_id': eventId}, function (err, event) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if (event) {
                // Check User has already liked or not
                console.log('share:' + event.share);
                console.log('length:' + event.share.length);

                // If chưa có ai share hết
                if(event.like.length == 0){
                    eventDetail.update({'_id': eventId}, {$push: {share: {'userID': userId, 'name': userName}}}, function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(500, 'Sorry. You are not handsome enough to do this!');
                        }
                        return res.send(200, 'Like.');
                    });
                }

                else{
                    var flash = 1;
                    for (var i = 0; i < event.like.length ; i++) {
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
                    console.log('flash: ' + flash);
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


            }
        });
    })

}