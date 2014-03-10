/**
 * Created by Nova on 2/11/14.
 */
var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , fs = require('fs'),
    im = require('imagemagick')
    , formidable = require('formidable')
user = require(path.join(HOME + "/models/user"));
var mongoose = require('mongoose');
var User = require(path.join(HOME + "/models/user"));
var EventDetail = require("../../models/eventDetail")
var EventRequest = require('../../models/eventRequest');
var helper = require(path.join(HOME + "/../helper/event.Helper"));
var Helper = require(path.join(HOME + "/../helper/helper"));
var _ = require('lodash');


//=============================================================================
// Nghĩa- Recode 10/2/2014
// GET: Get event page
exports.getEvent = function (req, res, next, eventId) {
    console.log("Get event");
    EventDetail.findOne({'_id': eventId}, function (err, event) {
        if (err) return next();
        if (event) {
            console.log("privacy: " + event.privacy);
            console.log("color: " + event.color);
            req.currEvent = event;
            next();
        }
    });
}


//================================================================================================
//Nghia- 10/2/2014
// show event
exports.showEvent = function (req, res) {
    console.log("Show event");
    var event = req.currEvent;
    //console.log("event" + event);
    return res.send(event);
}


//=============================================================================
// Nghĩa- Recode 10/2/2014
//    Create event
exports.createEvent = function (req, res) {
    var userId = req.body.userId;
    //console.log('event : ' + JSON.stringify(req.body))
    User.findOne({'_id': userId}).exec(function (err, user) {
        console.log("Create Event");
        console.log("Create Event" + req.body.color);
        // initiate startTime,endTime
        var startTime = new Date();
        var endTime = new Date();
        var startHour;
        var endHour;

        // create startTime
        if (req.body.year1 && req.body.month1 && req.body.hour1 && req.body.minute1 && req.body.step1) {
            //set value for hour of startTime
            if (req.body.step1 == "PM") {
                startHour = req.body.hour1 + 12;
            }
            else startHour = req.body.hour1;
            //set starTime
            startTime.setDate(req.body.date1);
            startTime.setFullYear(req.body.year1);
            startTime.setMonth((req.body.month1));
            startTime.setHours(startHour, req.body.minute1, 0);
            //console.log("startTime" + startTime);
        }
        else {
            startTime = ""
        }

        // create endTime
        if (req.body.year2 && req.body.month2 && req.body.hour2 && req.body.minute2 && req.body.step2) {
            //set value for hour of startTime
            if (req.body.step2 == "PM") {
                endHour = req.body.hour2 + 12;
            }
            else endHour = req.body.hour2;
            //set endTime
            endTime.setDate(req.body.date2);
            endTime.setFullYear(req.body.year2);
            endTime.setMonth((req.body.month2));
            endTime.setHours(endHour, req.body.minute2, 0);
            //console.log("endTime" + endTime);
        }
        else {
            endTime = ""
        }

        event = new EventDetail({
            name: req.body.name,
            startTime: startTime,
            endTime: endTime,
            description: req.body.description,
            location: req.body.location,
            privacy: req.body.privacy,
            creator: {
                avatar: user.avatar,
                fullName: user.fullName,
                username: user.local.username,
                userID: user._id
            },
            color: req.body.color,
            alarm: req.body.alarm
        });
        //console.log("event: "+event);
        event.save(function (err) {
            console.log("save");
            if (!err) {
                res.jsonp(event);
                // console.log(event);
            } else {
                res.send(err);
            }
        });
    });
}

//=============================================================================
// Nghĩa- Recode 10/2/2014
//    update event
exports.editEvent = function (req, res) {
    console.log("Edit event");
    var currEvent = req.currEvent;
    currEvent = _.extend(currEvent, req.body);
    currEvent.save(function (err) {
        if (err) {
            console.log("Err: " + err);
            return res.send(err);
        }
        else {
            console.log("Save !!!");
            res.jsonp(currEvent);
        }
    })

}


//===============================================================================
// Nghĩa- Recode 12/2/2014
//    for validate
exports.checkUniqueName = function (req, res, next) {
    var str = req.body.target;
    str.toLowerCase();
    var query = {'name': str};

    //console.log('target: ' + str + 'query:' + JSON.stringify(query));
    EventDetail.count(query, function (err, n) {
        if (err) return console.log(err);

        if (n < 1) {
            // doesn't exist
            return res.send(200, true);
        } else {
            // existed
            return res.send(500, false);
        }
    });
};

//===============================================================================
// Nghĩa- Recode 13/2/2014
//    for update Image
exports.uploadImage = function (req, res) {
    var currEvent = req.currEvent;
    /// If there's an error
    if (!req.files.avatar.name) {
        //res.redirect('event/create');
    }
    else {
        // Resize image to 500x500
        im.resize({
            srcPath: req.files.avatar.path,
            //TODO: sửa lại đường dẫn lưu ảnh
            dstPath: './public/uploaded/event/' + req.files.avatar.name,
            width: 500
        }, function (err, stdout, stderr) {
            if (err) {
                console.log('File Type Error !');
                //res.redirect('/event/create');
            }
            console.log("ok ?");
            // Save link to database
            var photo = new Array();
            // TODO : đây nữa
            var pic = '/uploaded/event/' + req.files.avatar.name;
            photo.push(pic);

            var updates = {
                $set: {'photo': photo}
            };
            EventDetail.findById(currEvent._id, function (err, event) {
                event.update(updates, function (err) {
                    if (!err) {
                        res.jsonp(event);
                    }
                    ;
                })
            });
            // Delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(req.files.avatar.path, function () {
                if (err) throw err;
            });
        });
    }
}

//===============================================================================
// Nghĩa- Recode 13/2/2014
//    for Like

exports.like = function (req, res, next) {
    var currEvent = req.currEvent;
    var userID = req.session.passport.user.userId;
    console.log('Like Function');
    console.log('EventID:   ' + currEvent._id);
    EventDetail.findOne(currEvent._id, function (err, event) {
        event.likes(userID, function (err) {
            //TODO: send gì đây ?
            if (!err) res.send();
        });

    });
};

//=================================================================================
// Find friend In Array
//    for Like
function findFriendInArray(pos, sourceList, returnList, cb) {
    if (!returnList) returnList = [];
    User.findOne({'_id': sourceList[pos]}, function (err, user) {
        if (err) return cb(err);

        if (user) {
            returnList.push({
                username: user.local.username,
                userID: user._id,
                fullName: user.fullName,
                avatar: user.avatar,
                // TODO: Code lại cái inviteRight
                inviteRight: true,
                status: "w"
                //w: wait for acceptance
                //m: member
                //a: ask to join
            });

            // find another
            if (returnList.length == sourceList.length) {
                return cb(null, returnList);
            } else {
                findFriendInArray(++pos, sourceList, returnList, cb);
            }
        }
    });
}

//=================================================================================
// NghiaNV-14/2/2014
// updated by ThuanNH 19/2
// get all event relate to current User
exports.listAll = function (req, res) {
    var currentUser = req.session.passport.user;
    var userID = currentUser.id;
    var friend = [];
    var hideList = [];
    if (currentUser) {
        User.findOne({'_id': userID}, function (err, user) {
                if (!user.hideList) {
                    user.hideList = "";
                }
                for (var i = 0; i < user.friend.length; i++) {
                    friend.push(user.friend[i].userId)
                }

                for (var i = 0; i < user.hideList.length; i++) {
                    hideList.push(user.hideList[i].eventID)
                }
                // Tìm User và USer Friends --> array các ID
                var findFriend = {
                    $and: [
                        {'id': {$nin: hideList}},
                        // lấy event của mình và của bạn
                        {$or: [
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
                    ]
                }

                EventDetail.find(findFriend).sort('-lastUpdated').limit(2).exec(function (err, events) {
                    return res.send(200, {events: events});
                });
            }
        )
    }
}

//==========================================================================================
//NghiaNV- 14/2/2014
// For Post AJAX
exports.loadMore = function (req, res) {
    console.log("=============AJAX POST=============");
    var count = req.body.count;
    console.log("Count: " + count);
    var currentUser = req.session.passport.user;
    console.log("User: " + req.session.passport.user.id);
    var userID = currentUser.id;
    var friend = [];
    if (currentUser) {
        User.findOne({'_id': currentUser.id}, function (err, user) {
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

                EventDetail.find(findFriend).sort('-lastUpdated').limit(2).skip(2 * count).exec(function (err, events) {
                    res.send(200, events);
                    console.log("events: " + events);
                });


            }
        )
    }

};


//=================================================================================================================
// POST AJAX like
// NghiaNV- 14/2/2014
exports.likeEvent = function (req, res) {
    var eventId = req.body.id;
    var userId = req.session.passport.user.id;
    console.log("UserID: " + userId);
    console.log("eventID: " + eventId);
    var userName = req.session.passport.user.username;
    // find event
    EventDetail.findOne({'_id': eventId}, function (err, event) {
        if (err) {
            console.log("err " + err);
            return res.send(500, 'Something wrong just happened. Please try again.');
        }

        if (event) {
            // Check User has already liked or not
            console.log("abc");
            console.log('like:' + event.like);
            console.log('length:' + event.like.length);

            if (event.like.length > 0) {
                var flash = 0;
                for (var i = 0; i < event.like.length; i++) {
                    if (event.like[i].userID == userId) {
                        flash = 1;
                        // user has already liked this event => unlike it
                        EventDetail.update({'_id': eventId}, {$pull: {like: {'userID': userId}}}, function (err) {
                            if (err) {
                                console.log(err);
                                return res.send(500, 'Sorry. You are not handsome enough to do this!');
                            }
                            return res.send('Unlike');
                        });
                        break;
                    }
                }
                if (flash == 0) {
                    EventDetail.update({'_id': eventId}, {$push: {like: {'userID': userId, 'name': userName}}}, function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(500, 'Sorry. You are not handsome enough to do this!');
                        }
                        return res.send('Like');
                    });
                }
            }
            // If chưa có ai like hết
            else {
                EventDetail.update({'_id': eventId}, {$push: {like: {'userID': userId, 'name': userName}}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Sorry. You are not handsome enough to do this!');
                    }
                    return res.send('Like');
                });
            }


        }
    });
};

//==================================================================================================
// NghiaNV - 14/2/2014
// AJAX post share
exports.share = function (req, res) {
    var eventId = req.body.id;
    var userId = req.session.passport.user.id;
    var userName = req.session.passport.user.username;
    console.log("UserID: " + userId);
    console.log("eventID: " + eventId);

    // find event
    EventDetail.findOne({'_id': eventId}, function (err, event) {
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
            if (event.creator.userID != userId && shareL == 0 && userL == 0) {
                EventDetail.update({'_id': eventId}, {$push: {share: {'userID': userId, 'name': userName}}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Sorry. You are not handsome enough to do this!');
                    }
                    return res.send(200, 'Success');
                });
            }

            // If user is creator
            if (event.creator.userID == userId) {
                flash = 1;
                return res.send(200, 'Shared');
            }

            // If user are a member
            var userL = event.user.length;
            if (userL > 0) {
                for (var i = 0; i < userL; i++) {
                    if (event.user[i].userID == userId) {
                        flash = 1;
                        return res.send(200, 'Shared');
                        break;
                    }
                }
            }

            // If user already share it
            var shareL = event.share.length;
            if (shareL > 0) {
                for (var i = 0; i < shareL; i++) {
                    if (event.share[i].userID == userId) {
                        flash = 1;
                        return res.send(200, 'Shared');
                        break;
                    }
                }
            }
            if (flash == 0) {
                EventDetail.update({'_id': eventId}, {$push: {share: {'userID': userId, 'name': userName}}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Sorry. You are not handsome enough to do this!');
                    }
                    return res.send(200, 'Success');
                });
            }

        }
    });
}


//==========================================================================================================================
// Update event's intro
// NghiaNV-20/2/2014
exports.updateEventIntro = function (req, res) {
    var startTime = new Date();
    var endTime = new Date();
    console.log("Update event's intro")
    console.log("event:" + JSON.stringify(req.body));
    // initiate startTime,endTime

    // create startTime
    if (req.body.date1 && req.body.year1 && req.body.month1 && req.body.hour1 && req.body.minute1 && req.body.step1) {
        //set starTime
        startTime.setDate(req.body.date1);
        startTime.setFullYear(req.body.year1);
        startTime.setMonth((req.body.month1));
        startTime.setHours(req.body.hour1, req.body.minute1, 0);
        console.log("startTime 1" + startTime);
        //set value for hour of startTime
        if (req.body.step1 == "PM") {
            console.log("Hour 1:" + req.body.hour1)
            startTime.setHours(startTime.getHours() + 12);
            console.log("startTime:" + startTime)
        }
    }
    else {
        startTime = ""
    }

    // create endTime
    if (req.body.date2 && req.body.year2 && req.body.month2 && req.body.hour2 && req.body.minute2 && req.body.step2) {
        //set endTime
        endTime.setDate(req.body.date2);
        endTime.setFullYear(req.body.year2);
        endTime.setMonth((req.body.month2));
        endTime.setHours(req.body.hour2, req.body.minute2, 0);
        console.log("endTime" + endTime);
        //set value for hour of startTime
        if (req.body.step2 == "PM") {
            console.log("Hour 2: " + req.body.hour2);
            endTime.setHours(endTime.getHours() + 12);
            console.log("EndTime:" + endTime);
        }
    }
    else {
        endTime = "";
        console.log("EndTime:" + endTime);
    }

    // update event intro
    EventDetail.findById(req.body.eventId, function (err, event) {
        event.name = req.body.name;
        event.startTime = startTime;
        event.endTime = endTime;
        event.description = req.body.description;
        event.location = req.body.location;
        //event.privacy = req.body.privacy;
        event.save(function (err) {
            if (!err) {
                console.log("updated");
                res.send(event);
                //console.log("send event:" +event);
            } else {
                res.send(err);
            }
        });
    });
}


//==========================================================================================================================
// Update event's announcement
// NghiaNV-20/2/2014
exports.updateEventAnnouncement = function (req, res) {
    console.log("Update event's Announcement")
    console.log("event:" + JSON.stringify(req.body));
    EventDetail.findById(req.body.eventId, function (err, event) {
        event.announcement = req.body.announcement;
        event.save(function (err) {
            if (!err) {
                console.log("updated");
                res.send(event);
            } else {
                res.send(err);
            }
        });
    });
}


//==========================================================================================================================
// Update user's note
// NghiaNV-26/2/2014
exports.updateNoteUser = function (req, res) {
    console.log("Update event's Note")
    console.log("event:" + JSON.stringify(req.body));
    var userID = req.session.passport.user.userId;
    EventDetail.findById(req.body.eventId, function (err, event) {
        var userL = event.user.length;
        for (var i = 0; i < userL; i++) {
            if (event.user[i].userID == userID) {
                if(event.user[i].note.title == null){
                    event.user[i].note.title= "";
                }
                if(event.user[i].note.content == null){
                    event.user[i].note.content= "";
                }
                event.user[i].note.title = req.body.title;
                event.user[i].note.content = req.body.content;
                break;
            }
        }
        event.save(function (err) {
            if (!err) {
                console.log("updated");
                res.send(event);
            } else {
                res.send(err);
            }
        });
    });
}


//==========================================================================================================================
// Update creator's note
// NghiaNV-26/2/2014
exports.updateNoteCreator = function (req, res) {
    console.log("Update creator's Note")
    console.log("event:" + JSON.stringify(req.body));
    EventDetail.findById(req.body.eventId, function (err, event) {
        // If user are a member
        if(event.creator.note.title == null){
            event.creator.note.title= "";
        }
        if(event.creator.note.content == null){
            event.creator.note.content= "";
        }
        event.creator.note.title = req.body.title;
        event.creator.note.content = req.body.content;
        event.save(function (err) {
            if (!err) {
                console.log("updated");
                res.send(event);
            } else {
                res.send(err);
            }
        });
    });
}

//==========================================================================================================================
// AJAX hide event's post
exports.hide = function (req, res) {
    var eventId = req.body.id;
    var userId = req.session.passport.user.id;
    console.log("UserID: " + userId);
    console.log("eventID: " + eventId);

    // find user
    User.findOne({'id': userId}, function (err, user) {
        if (err) {
            console.log("Err :" + err);
        }
        else {
            var hideL = user.hideList.length;
            if (hideL == 0) {
                User.update({'_id': userId}, {$push: {hideList: {'eventID': eventId}}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Sorry. You are not handsome enough to do this!');
                    }
                    return res.send(200, 'Hided.');
                })
            }
            else {
                var flash = 0;
                for (var i = 0; i < hideL; i++) {
                    if (user.hideList[i].eventID == eventId) {
                        console.log(err);
                        flash = 1
                        return res.send(500, 'Already hided it!');
                        break;
                    }
                }
                if (flash == 0) {
                    User.update({'_id': userId}, {$push: {hideList: {'eventID': eventId}}}, function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(500, 'Sorry. You are not handsome enough to do this!');
                        }
                        return res.send(200, 'Hided');
                    })
                }
            }
        }
    })
}


//=================================================================================
// NghiaNV-14/2/2014
// get all event relate to current User
exports.getAll = function (req, res) {
    var currentUser = req.session.passport.user;
    var userID = currentUser.id;
    console.log("test: " + JSON.stringify(req.session.passport));
    console.log("User: " + currentUser.id);
    if (currentUser) {
        var findEvent = {$or: [
            {'creator.userID': userID},
            {
                $and: [
                    {'user.userID': userID},
                    {'user.status': {$in: ['m', 'a']}}
                ]
            }
        ]}

        var returnEvents = [];
        EventDetail.find(findEvent).exec(function (err, events) {
            events.forEach(function (event) {
                //console.log("Event :" + event);
                var returnEvent = {
                    url: '/event/view/' + event._id,
                    title: event.name,
                    start: new Date(event.startTime),
                    end: new Date(event.endTime)
                }
                returnEvents.push(returnEvent);
                //console.log("Return Event:"+ JSON.stringify(returnEvent));
            })
            //console.log("Return Events: "+ JSON.stringify(returnEvents));
            res.send(returnEvents);
        });
    }
    else(res.send("Something happened"));
}

/**
 * thuannh
 * check event request status between the current user and this event
 *
 * @param req
 * @param res
 * @param next
 */
exports.checkEventRequestStatus = function(req, res, next){
    var eventId = req.params.eventId;
    console.log('even: ' + eventId);
    // find the event request between this event and the current user
    EventRequest.findOne({'user':req.session.passport.user.userId,'event':eventId},function(err, request){
        if(err) return res.send(200,{error:err});

        if(request){
            // the request is exist
            return res.send(200, 'waiting');
        }else{
            // if user joined, return joined
            // else, return unknown
            EventDetail.findOne({'_id':eventId},function(err, event){
                if(err) return res.send(200,{error:err});

                if(event){
                    if(event.user.length == 0){
                        return res.send(200, 'unknown');
                    }else{
                        for(var i=0;i<event.user.length;i++){
                            if(event.user[i].userID == req.session.passport.user.userId){
                                // user joined
                                return res.send(200, 'joined');
                            }
                        }
                        return res.send(200, 'unknown');
                    }
                }else{
                    return res.send(200, {error: 'Event is no longer exist.'});
                }
            });
        }
    });
}

/**
 * thuannh
 * cancel event request
 *
 * @param req
 * @param res
 * @param next
 */
exports.cancelEventRequest = function (req, res, next) {
    var user = req.body.userId;
    var event = req.body.eventId;
    // delete event request
    EventRequest.findOne({'user': user, 'event': event}, function (err, request) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something wrong just happened. Please try again.');
        }

        if (request) {
            // delete request
            request.remove(function (err, request) {
                if (err) {
                    console.log(err);
                    return res.send(500, 'Something wrong just happened. Please try again.');
                }

                // pull this user out of event's user list
                EventDetail.update({'_id': event}, {$pull: {'user': {'userId': user}}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Something wrong just happened. Please try again.');
                    }

                    return res.send(200, 'canceled');
                });
            });
        } else {
            return res.send(200, 'need-quit');
        }
    });
}

/**
 * thuannh
 * quit event
 *
 * @param req
 * @param res
 * @param next
 */
exports.quitEvent = function (req, res, next) {
    var eventId = req.body.eventId;
    var userId = req.body.userId;

    // find a request
    EventRequest.findOne({'event': eventId, 'user': userId}, function (err, request) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something wrong just happened. Please try again.');
        }

        if (request) {
            return res.send(200, 'quited');
        } else {
            // pull this user out of event's user list
            EventDetail.update({'_id': eventId}, {$pull: {'user': {'userId': userId}}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.send(500, 'Something wrong just happened. Please try again.');
                }

                return res.send(200, 'quited');
            });
        }
    });
}

/**
 * thuannh
 * join event
 *
 * @param req
 * @param res
 * @param next
 */
exports.joinEvent = function (req, res, next) {
    var eventId = req.body.eventId;
    var userId = req.body.userId;

    if (eventId && userId) {
        // check if a request between event and user is exist
        EventRequest.findOne({'event': eventId, 'user': userId}, function (err, request) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if (request) {
                return res.send(200, 'joined');
            } else {
                // send the owner of this event a request
                var eventRequest = new EventRequest();

                eventRequest.event = eventId;
                eventRequest.user = userId;
                eventRequest.save(function (err, request) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Something wrong just happened. Please try again.');
                    }

                    // add user to event's user list
                    User.findOne({'_id': userId}, function (err, user) {
                        if (err) {
                            console.log(err);
                            return res.send(500, 'Something wrong just happened. Please try again.');
                        }

                        // initialize embedded user in user list
                        var embeddedUser = {
                            fullName: user.fullName,
                            userId: user._id
                        };
                        // local.username if it's local account
                        // facebook.displayName if it's facebook account
                        // google.displayName if it's google account
                        if (user.local) {
                            embeddedUser.username = user.local.username;
                        } else {
                            embeddedUser.username = user.facebook.displayName ? user.facebook : user.google.displayName;
                        }
                        // add embedded user to event's user list
                        EventDetail.update({'_id': eventId}, {$push: {user: embeddedUser}}, function (err) {
                            if (err) {
                                console.log(err);
                                return res.send(500, 'Something wrong just happened. Please try again.');
                            }

                            // return joined
                            return res.send('joined');
                        })
                    });
                });
            }
        });
    } else {
        return res.send(500, 'Route params error');
    }
}

/**
 * created by Nghia
 * updated by Thuan at 19/2
 *
 * @param req
 * @param res
 * @param next
 */
exports.invite = function (req, res, next) {
    var eventId = req.body.eventId;
    var candidates = req.body.friends;
    var invitors = req.body.invitors;

    if (!Array.isArray(candidates)) {
        // kiểm tra nếu argument đưa về từ client là chuỗi hay là mảng
        // nếu là chuỗi, thì push vào cái mảng
        var temp = candidates;
        candidates = [];
        candidates.push(temp);
    }
    if (!Array.isArray(invitors)) {
        // kiểm tra nếu argument đưa về từ client là chuỗi hay là mảng
        // nếu là chuỗi, thì push vào cái mảng
        var temp = invitors;
        invitors = [];
        invitors.push(temp);
    }

    // send every friends in this event an event request
    Helper.mergeArray(candidates, invitors, function (err, candidates) {
        if (err) return next();

        // send request
        var embeddedList = [];
        sendMultiRequest(candidates, invitors, candidates.length, eventId, embeddedList, function (err, embeddedList) {
            if (err) return next();
            // push is all into the event's user list
            EventDetail.update({'_id': eventId}, {$pushAll: {user: embeddedList}}, function (err) {
                if (err) {
                    console.log('Error:  ' + err);
                    res.send(500, 'Something Wrong !', {eventID: eventId});
                }
                // Add Successful
                // add invitors
                // push is all into the event's invite list
                res.send(200, 'invited');
            });
        });
    });
}

/**
 * Nghia created
 * Thuan updated
 *
 * get timeshelf
 *
 * @param req
 * @param res
 * @param next
 */
exports.timeshelf = function (req, res, next) {
    var ownerId = req.params.ownerId;
    // Tìm tất cả cách event của User
    User.findOne({'_id': ownerId}, function (err, user) {
        if (err) console.log('Error: ' + err);
        // Điều kiện tìm kiếm
        // + Event creator = bản thân
        // + Event có user.status = M hoặc A ( Member hoặc ẠTJ)
        var findEvent = {$or: [
            {'creator.userID': ownerId},
            {
                $and: [
                    {'user.userID': ownerId},
                    {'user.status': {$in: ['m', 'a']}}
                ]
            }
        ]};

        if (user) {
            EventDetail.find(findEvent).sort('-lastUpdated').limit(2).exec(function (err, events) {
                if (err) console.log(err);
                return res.send(200, {user: user, events: events});
            });
        }
    });
}

/**
 * thuannh
 * send event request to many people
 *
 * @param candidates
 * @param total
 * @param eventId
 * @param embeddedList
 * @param cb
 * @returns {*}
 */
function sendMultiRequest(candidates, inviteRightList, total, eventId, embeddedList, cb) {
    total--;
    if (total < 0) {
        return cb(null, embeddedList);
    }

    var candidateId = candidates[total];
    // check if he can invite
    var canInvite = false;
    for (var i = 0; i < inviteRightList.length; i++) {
        var temp = inviteRightList[i];
        if (temp.indexOf(candidateId) > -1) {
            canInvite = true;
        }
    }
    // send candidate a request
    var request = new EventRequest();
    request.user = candidateId;
    request.event = eventId;

    request.save(function (err) {
        if (err) return cb(err);

        // add user to event's user list
        User.findOne({'_id': candidateId}, function (err, user) {
            if (err) return cb(err);

            // initialize embedded user in user list
            var embeddedUser = {
                fullName: user.fullName,
                userID: user._id
            };
            // local.username if it's local account
            // facebook.displayName if it's facebook account
            // google.displayName if it's google account
            if (user.local) {
                embeddedUser.username = user.local.username;
            } else {
                embeddedUser.username = user.facebook.displayName ? user.facebook : user.google.displayName;
            }
            // notice that he can invite
            embeddedUser.inviteRight = canInvite;
            // add embedded user to event's user list
            embeddedList.push(embeddedUser);

            return sendMultiRequest(candidates, total, eventId, embeddedList, cb);
        });
    });
}


//===============================================================================================================
// NghiaNV-21/2/2014
// Upload Image
exports.uploadImage = function (req, res) {
    console.log("Upload Image");
    console.log(req.files.image);
    var image = req.files.image;
    var newImageLocation = path.join(__dirname, 'public/img', image.name);

    fs.readFile(image.path, function (err, data) {
        fs.writeFile(newImageLocation, data, function (err) {
            res.json(200, {
                src: 'img/' + image.name,
                size: image.size
            });
        });
    });
};

/**
 * TrungNM - add comment
 * URL: 'api/event/:id/addComment'
 */
exports.addComment = function(req, res) {
    // Lấy thông tin từ Client
    var comment = req.body.comment;
    var eventID = req.params.id;

    // Sinh ra 1 id cho comment
    var idComment = mongoose.Types.ObjectId();

    // Chuẩn bị Query để thêm comment vào event
    var updates = {
            $push: {
                'comment': {
                    _id: idComment,
                    username: comment.username,
                    fullName: comment.fullName,
                    avatar: comment.avatar,
                    content: comment.content,
                    datetime: comment.datetime
                }
            }
        };
    // Thêm Comment vào Event
    EventDetail.update({'_id': eventID}, updates, function (err) {
            if (err) {
                console.log(err);
                res.send(500, 'Something Wrong !');
            }
    });

    // Nếu thành công gửi hàng về đồng bằng
    res.send(200, {idComment: idComment} );
};

/**
 * TrungNM - remove comment
 * URL: 'api/event/:id/removeComment'
 */
exports.removeComment = function (req, res){
    var comment = req.body.comment;
    var eventID = req.params.id;
    var updates = {
        $pull: {
            'comment': {_id: comment._id}
        }
    };
    console.log('SIda:  ' + comment._id);
    EventDetail.update({'_id': eventID}, updates, function (err, event) {
        if (err) {
            console.log('Something Wrong');
            res.send(500, 'Something Wrong !');
        }
    });
    res.send(200);
}