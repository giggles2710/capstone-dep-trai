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
                    }
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
                        res.render('event/home', {title: user.fullName, events: events, user: user});
                    });

                }
            )
        }
    })



//==========================================================================================
// For Post AJAX
    app.post('/myniti', function (req, res) {
        console.log("=============AJAX POST=============");
        var count = req.body.count;
        console.log("Count: "+ count);
        var currentUser = req.session.user;
        console.log("User: " + req.session.user.id);
        var userID = currentUser.id;
        var friend = [];
        if (currentUser) {
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                    for (var i = 0; i < user.friend.length; i++) {
                        friend.push(user.friend[i].userId)
                        //console.log(user.friend[i].userId);
                    }
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
                        res.send(200, events);
                        console.log("events: " + events);
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
                console.log("err "+err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if (event) {
                // Check User has already liked or not
                console.log("abc");
                console.log('like:' + event.like);
                console.log('length:' + event.like.length);

                if(event.like.length > 0){
                    var flash = 0;
                    for (var i = 0; i < event.like.length ; i++) {
                        if (event.like[i].userID == userId) {
                            flash = 1;
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
                    }
                    if(flash == 0){
                        eventDetail.update({'_id': eventId}, {$push: {like: {'userID': userId, 'name': userName}}}, function (err) {
                            if (err) {
                                console.log(err);
                                return res.send(500, 'Sorry. You are not handsome enough to do this!');
                            }
                            return res.send(200, 'Like.');
                        });
                    }
                }
                // If chưa có ai like hết
                else{
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



//====================================================================================================
    // AJAX share
    app.get('/share', function (req, res) {
        res.render('event/share');
    })

   // AJAX post share
    app.post('/share',function(req,res){
        var eventId = req.body.id;
        var userId = req.session.user.id;
        var userName = req.session.user.fullName;
        console.log("UserID: " + userId);
        console.log("eventID: " + eventId);

        // find event
        eventDetail.findOne({'_id': eventId}, function (err, event) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }
            if (event) {
                // Check User if they are creator or member or already share
                console.log('share:' + event.share);
                console.log('length:' + event.share.length);
                var flash = 0;

                // Nobody involve in this event
                if(event.creator.userID != userId && shareL ==0 && userL==0){
                    eventDetail.update({'_id': eventId}, {$push: {share: {'userID': userId, 'name': userName}}}, function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(500, 'Sorry. You are not handsome enough to do this!');
                        }
                        return res.send(200, 'Successful sharing.');
                    });
                }

                // If user is creator
                if(event.creator.userID == userId){
                    flash = 1;
                    return res.send(200, 'You are the creator of this event.');
                }

                // If user are a member
                var userL = event.user.length;
                if(userL >0){
                for(var i = 0; i<userL; i++){
                    if (event.user[i].userID == userId){
                        flash =1;
                        return res.send(200, 'You are the member of this event.');
                        break;
                    }
                }
                }

                // If user already share it
                var shareL = event.share.length;
                if(shareL >0){
                    for(var i = 0; i<shareL; i++){
                        if (event.share[i].userID == userId){
                            flash =1;
                            return res.send(200, 'You already share this on your timeshelf.');
                            break;
                        }
                    }
                }
                if(flash == 0){
                    eventDetail.update({'_id': eventId}, {$push: {share: {'userID': userId, 'name': userName}}}, function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(500, 'Sorry. You are not handsome enough to do this!');
                        }
                        return res.send(200, 'Successful sharing.');
                    });
                }

            }
        });
    })

}