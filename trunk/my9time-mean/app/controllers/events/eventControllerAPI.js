/**
 * Created by Nova on 2/11/14.
 */
var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , fs = require('fs')
    , im = require('imagemagick')
    , formidable = require('formidable')
    , fsx = require('fs-extra')
    , easyimg = require('easyimage')
    , user = require(path.join(HOME + "/models/user"));
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require(path.join(HOME + "/models/user"));
var Notification = require("../../models/notification");
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
    var month1 = req.body.month1;
    var month2 = req.body.month2;
    //console.log('event : ' + JSON.stringify(req.body))
    User.findOne({'_id': userId}).exec(function (err, user) {
        console.log("Create Event");
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
            startTime.setMonth(req.body.month1);

            //  check năm nhuận
            if(((req.body.year1)%4)== 0 && req.body.month1 == 2){
                if(req.body.date1 == 29 || req.body.date1 == 30 || req.body.date1 == 31){
                    startTime.setDate(29);
                }
            }
            else if (((req.body.year1)%4)!= 0 && req.body.month1 == 2){
                if(req.body.date1 == 29 || req.body.date1 == 30 || req.body.date1 == 31){
                    startTime.setDate(28);
                }
            }

            else{
                //set starTime
                if(month1 != 1 && month1 !=3 && month1 !=5 && month1!=7 && month1 !=8 && month1 !=10 && month1 !=12 && req.body.date1 == 31){
                    startTime.setDate(30);
                }
                else startTime.setDate(req.body.date1);
            }
            startTime.setFullYear(req.body.year1);
            startTime.setHours(startHour, req.body.minute1, 0);
        }
        else {
            startTime = ""
        }

        // create endTime
        if (req.body.year2 && req.body.month2 && req.body.hour2 && req.body.minute2 && req.body.step2) {
            //set value for hour of endTime
            if (req.body.step2 == "PM") {
                endHour = req.body.hour2 + 12;
            }
            else endHour = req.body.hour2;
            endTime.setMonth((req.body.month2));
            if(((req.body.year2)%4)== 0 && req.body.month2 == 2){
                if(req.body.date2 == 29 || req.body.date2 == 30 || req.body.date2 == 31){
                    endTime.setDate(29);
                }
            }
            else if (((req.body.year2)%4)!= 0 && req.body.month2 == 2){
                if(req.body.date2 == 29 || req.body.date2 == 30 || req.body.date2 == 31){
                    endTime.setDate(28);
                }
            }
            else{
                //set endDate
                if(month2 != 1 && month2 !=3 && month2 !=5 && month2!=7 && month2 !=8 && month2 !=10 && month2 !=12 && req.body.date2 == 31){
                    endTime.setDate(30);
                }
                else endTime.setDate(req.body.date2);
            }
            endTime.setFullYear(req.body.year2);
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
            if (!err) {
                res.jsonp(event);
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
            return res.send(err);
        }
        else {
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
            dstPath: './public/uploaded/event/' + req.files.avatar.name,
            width: 500
        }, function (err, stdout, stderr) {
            if (err) {
                console.log('File Type Error !');
                //res.redirect('/event/create');
            }
            // Save link to database
            var photo = new Array();
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
// Nghĩa- Recode 15/3/2014
//    for isLike

exports.isLike = function (req, res, next) {
    var currEvent = req.query.eventID;
    var userID = req.session.passport.user.id;
    console.log('isLike Function');
    EventDetail.findOne({'_id': currEvent}, function (err, event) {
        // ThuanNH
        if(err) return res.send(500, err);

        if(event){
            var isLike = "unLike";
            if(!event.like){
                event.like = '';
            }
            for(var i=0;i<event.like.length;i++){
                if(event.like[i].userID == userID){
                    isLike = "Like";
                }
            }
            return res.send({isLike :isLike , length : event.like.length});
        }else{
            return res.send(500, 'No such event');
        }
    });
};

//===============================================================================
// Nghĩa- 24/3/2014
//    for getAnnouncement

exports.getAnnouncement = function (req, res) {
    var currEvent = req.query.eventID;
    //var userID = req.session.passport.user.id;
    console.log('getAnnouncement Function');
    EventDetail.findOne({'_id': currEvent}, function (err, event) {
        if(err) return res.send(500, err);
        if(event){
            res.send(event.announcement);
        }else{
            return res.send(500, 'No such event');
        }
    });
};


//===============================================================================
// Nghĩa- 24/3/2014
//    for getEventIntro

exports.getEventIntro = function (req, res) {
    var currEvent = req.query.eventID;
    //var userID = req.session.passport.user.id;
    console.log('getEventIntro Function');
    EventDetail.findOne({'_id': currEvent}, function (err, event) {
        if(err) return res.send(500, err);
        if(event){
            res.send({name : event.name, startTime : event.startTime, endTime: event.endTime, location: event.location, description: event.description});
        }else{
            return res.send(500, 'No such event');
        }
    });
};


//===============================================================================
// Nghĩa- Recode 15/3/2014
//    for Like

exports.like = function (req, res) {
    var currEvent = req.body.eventID;
    var number = 0;
    var userID = req.session.passport.user.id;
    var userName = req.session.passport.user.username;
    console.log('Like Function');
    // find event
    EventDetail.find(currEvent, function (err, event) {
        if(err){
            return res.send(500, err);
        }
        if(event){
            if(!event.like){
                event.like="";
            }
            number = event.like.length + 1;
            EventDetail.update({_id : currEvent},{$push: {like: {'userID': userID, 'name': userName}}}, function (err) {
                if(!err){
                    var relatedPeople = Helper.findUsersRelatedToEvent(event);
                    sendUpdateLikeToUsers(relatedPeople,req.session.passport.user,userID,event._id,function(err,result){
                    })
                }
                else {
                    console.log(err);
                    res.send(500, 'Sorry. You are not handsome enough to do this!');
                }
            });
            console.log("======" + number)
            res.send({isLike : 'Like',number : number});
        }
        else {
            return res.send(500, 'No such event');
        }

    });


};

//===============================================================================
// Nghĩa- Recode 15/3/2014
//    for unLike

exports.unLike = function (req, res) {
    console.log('unLike Function');
    var currEvent = req.body.eventID;
    var userID = req.session.passport.user.id;
    var number = 0;

    EventDetail.findOne(currEvent, function (err, event) {
        if(err){
            return res.send(500, err);
        }
        if(event){
            if(!event.like){
                number = 0;
            }
            else{
                number = event.like.length;
            }

            EventDetail.update({_id : currEvent},{$pull: {like: {'userID': userID}}},function (err) {
                if (err) {
                    res.send(500, 'Sorry. You are not handsome enough to do this!');
                }
            });
            res.send({isLike : 'unLike',number : number});
        }
        else{
            res.send(500,'No such event')
        }
    });
};



//==================================================================================================
// NghiaNV - 17/3/2014
// AJAX post isShare
exports.isShare = function (req, res, next) {
    var currEvent = req.body.eventID;
    var userID = req.session.passport.user.id;
    console.log('isShare Function');

    var isShared = false;
    EventDetail.findOne({_id : currEvent}, function (err, event) {
        if(err){
            console.log("Err : "+ err);
        }
        if(event){
            // if curUser is the creator so he/she can not share it
            if(event.creator.userID == userID){
                isShared = true
            }
            // initiate user
            if(!event.user){
                event.user="";
            }
            // initiate share
            if(!event.share){
                event.share="";
            }
            // if curUser is a member of event so he/she can not share it
            for(var i = 0; i < event.user.length; i++){
                if(userID == event.user[i].userID){
                    isShared = true;
                }
            }
            // if curUser has already shared it so he/she can not share it
            for(var i = 0; i < event.share.length; i++){
                if(userID == event.share[i].userID){
                    isShared = true;
                }
            }
            res.send(isShared);
        }
        else{
            res.send(500,'No such event')
        }
    });
};




//==================================================================================================
// NghiaNV - 17/3/2014
// AJAX post share
exports.share = function (req, res) {
    var currEvent = req.body.eventID;
    var userId = req.session.passport.user.id;
    var userName = req.session.passport.user.username;

    EventDetail.update({'_id': currEvent}, {$push: {share: {'userID': userId, 'name': userName}}}, function (err) {
         if (err) {
              console.log(err);
              return res.send(500, 'Sorry. You are not handsome enough to do this!');
         }
         else{
             return res.send(200, 'Success');
         }
    });
}




//==================================================================================================
// NghiaNV - 17/3/2014
// AJAX post isHighlight
exports.isHighlight = function (req, res, next) {
    var currEvent = req.body.eventID;
    var userID = req.session.passport.user.id;
    console.log('isHighlight Function');

    var isHighlight = false;
    var isError = false;
    EventDetail.findOne({_id : currEvent}, function (err, event) {
        if(err){
            console.log("Err : "+ err);
        }
        if(event){
            if(event.creator.userID == userID){
                if(event.creator.highlight){
                    if(event.creator.highlight == true)
                    isHighlight = true;
                }
            }
            else{
                // initiate user
                if(event.user){
                    for(var i = 0; i < event.user.length; i++){
                        if(userID == event.user[i].userID && event.user[i].highlight == true){
                            isHighlight = true;
                        }
                        if(userID == event.user[i].userID && event.user[i].status != 'confirmed'){
                            isError = true;
                        }
                    }
                }
            }

            res.send({'isHighlight':isHighlight,'isError':isError});
        }
        else{
            res.send(500,'No such event')
        }
    });
};




//==================================================================================================
// NghiaNV - 17/3/2014
// AJAX post isHighlight
exports.highlight = function (req, res) {
    var currEvent = req.body.eventID;
    var userID = req.session.passport.user.id;
    console.log('Highlight Function');

    EventDetail.findOne({_id : currEvent}, function (err, event) {
        if(err){
            console.log("Err : "+ err);
        }
        if(event){
            if(event.creator.userID == userID){
                event.creator.highlight = true;
                User.update({'_id': userID}, {$push: {highlight: {'eventID': currEvent}}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Sorry. You are not handsome enough to do this!');
                    }
                    else{
                        res.send(200,'Highlight');
                    }
                })
            }
            else{
                if(event.user){
                    for(var i = 0; i < event.user.length; i++){
                        if(userID == event.user[i].userID){
                            event.user[i].highlight = true;
                            User.update({'_id': userID}, {$push: {highlight: {'eventID': currEvent}}}, function (err) {
                                if (err) {
                                    console.log(err);
                                    return res.send(500, 'Sorry. You are not handsome enough to do this!');
                                }
                                else{
                                    res.send(200,'Highlight');
                                }
                            })
                        }
                    }
                }
            }
            event.save(function (err) {
                if (err) {
                    res.send(err);
                }
            });
        }
        else{
            res.send(500,'No such event')
        }
    });
};




//==================================================================================================
// NghiaNV - 17/3/2014
// AJAX post isHighlight
exports.unHighlight = function (req, res) {
    var currEvent = req.body.eventID;
    var userID = req.session.passport.user.id;
    console.log('unHighlight Function');

    EventDetail.findOne({_id : currEvent}, function (err, event) {
        if(err){
            console.log("Err : "+ err);
        }
        if(event){
            if(event.creator.userID == userID){
                event.creator.highlight = false;
                User.update({'_id': userID}, {$pull: {highlight: {'eventID': currEvent}}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Sorry. You are not handsome enough to do this!');
                    }
                    else{
                        res.send(200,'unHighlight');
                    }
                })
            }
            else{
                if(event.user){
                    for(var i = 0; i < event.user.length; i++){
                        if(userID == event.user[i].userID){
                            event.user[i].highlight = false;
                            User.update({'_id': userID}, {$pull: {highlight: {'eventID': currEvent}}}, function (err) {
                                if (err) {
                                    console.log(err);
                                    return res.send(500, 'Sorry. You are not handsome enough to do this!');
                                }
                                else{
                                    res.send(200,'unHighlight');
                                }
                            })
                        }
                    }
                }
            }
            event.save(function (err) {
                if (err) {
                    res.send(err);
                }
            });

        }
        else{
            res.send(500,'No such event')
        }
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
    var ids = JSON.parse(req.query.ids);
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
                if(ids){
                    // merge with hidelist
                    Helper.mergeArray(hideList,ids);
                    // parse hide list into objectId
                    for(var i=0;i<hideList.length;i++){
                        var id =''+hideList[i];
                        hideList[i] = new ObjectId(id);
                    }
                }
                // Tìm User và USer Friends --> array các ID
                var findFriend = {
                    $and: [
                        {'_id': {$nin: hideList}},
                        {'isBanned':false},
                        // lấy event của mình và của bạn
                        {$or: [
                            //lấy event của mình
                            {
                                $and: [
                                    {'privacy': {$in: ['c', 'o' , 'g']}},
                                    {$or: [
                                        {$and: [
                                            {'user.userID': userID},
                                            {'user.status': {$in: ['confirmed']}}
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
                                            {'user.status': {$in: ['confirmed']}}
                                        ]},
                                        {'creator.userID': {$in: friend}}
                                    ]}
                                ]
                            }
                        ]
                        }
                    ]
                }

                EventDetail.find(findFriend).sort('-lastUpdated').limit(5).exec(function (err, events) {
                    return res.send(200, {events: events});
                });
            }
        );
    }
}




//=================================================================================
// NghiaNV-23/3/2014
// get all recent Event of current User
exports.getRecentEvent = function (req, res) {
    console.log("GET RECENT EVENT")
//    var ids = JSON.parse(req.query.ids);
    var ownerId = req.body.userID;
    var finalResult = [];
    // Tìm tất cả cách event của User
//    if(ids){
//        // parse hide list into objectId
//        for(var i=0;i<ids.length;i++){
//            var id = ids[i];
//            ids[i] = new ObjectId(id);
//        }
//    }
    User.findOne({'_id': ownerId}, function (err, user) {
        if (err) console.log('Error: ' + err);
        // Điều kiện tìm kiếm
        // + Event creator = bản thân
        // + Event có user.status = confirmed
        var findEvent =
//        {
//            '$and':
//            [
//                {'_id'  : {$nin: ids}},
                {'$or'  : [
                    {'creator.userID': ownerId},
                    {
                        $and: [
                            {'user.userID': ownerId},
                            {'user.status': {$in: ['confirmed']}}
                        ]
                    }
                ]}
//            ]
//        };

        if (user) {
            EventDetail.find(findEvent).sort('-lastUpdated').limit(5).exec(function (err, events) {
                events.forEach(function(event){
                    var result = {
                        eventID : event._id,
                        name : event.name
                    }
                    finalResult.push(result);
                })
//                console.log("============111"+finalResult)
                return res.send(200, finalResult);
            });

        }
    });
}





//==========================================================================================
//NghiaNV- 14/2/2014
// For Post AJAX
exports.loadMore = function (req, res) {
    console.log("=============AJAX POST=============");
    var count = req.body.count;
    var currentUser = req.session.passport.user;
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
                                    {'user.status': {$in: ['confirmed']}}
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
                                    {'user.status': {$in: ['confirmed']}}
                                ]},
                                {'creator.userID': {$in: friend}}
                            ]}
                        ]
                    }
                ]
                }

                EventDetail.find(findFriend).sort('-lastUpdated').limit(2).skip(2 * count).exec(function (err, events) {
                    res.send(200, events);
                });


            }
        )
    }

};



//==========================================================================================================================
// Update event's intro
// NghiaNV-20/2/2014
exports.updateEventIntro = function (req, res) {
    var startTime = new Date();
    var endTime = new Date();
//    var idComment = mongoose.Types.ObjectId();
//    var sendDate = new Date();
    var month1 = req.body.month1;
    var month2 = req.body.month2;
    console.log("Update event's intro")
    // initiate startTime,endTime

    if (req.body.year1 && req.body.month1 && req.body.hour1 && req.body.minute1 && req.body.step1) {
        //set value for hour of startTime
        if (req.body.step1 == "PM") {
            startHour = req.body.hour1 + 12;
        }
        else startHour = req.body.hour1;
        startTime.setMonth(req.body.month1);

        //  check năm nhuận
        if(((req.body.year1)%4)== 0 && req.body.month1 == 2){
            if(req.body.date1 == 29 || req.body.date1 == 30 || req.body.date1 == 31){
                startTime.setDate(29);
            }
        }
        else if (((req.body.year1)%4)!= 0 && req.body.month1 == 2){
            if(req.body.date1 == 29 || req.body.date1 == 30 || req.body.date1 == 31){
                startTime.setDate(28);
            }
        }

        else{
            //set starTime
            if(month1 != 1 && month1 !=3 && month1 !=5 && month1!=7 && month1 !=8 && month1 !=10 && month1 !=12 && req.body.date1 == 31){
                startTime.setDate(30);
            }
            else startTime.setDate(req.body.date1);
        }
        startTime.setFullYear(req.body.year1);
        startTime.setHours(startHour, req.body.minute1, 0);
    }
    else {
        startTime = ""
    }

    // create endTime
    if (req.body.year2 && req.body.month2 && req.body.hour2 && req.body.minute2 && req.body.step2) {
        //set value for hour of endTime
        if (req.body.step2 == "PM") {
            endHour = req.body.hour2 + 12;
        }
        else endHour = req.body.hour2;
        endTime.setMonth((req.body.month2));
        if(((req.body.year2)%4)== 0 && req.body.month2 == 2){
            if(req.body.date2 == 29 || req.body.date2 == 30 || req.body.date2 == 31){
                endTime.setDate(29);
            }
        }
        else if (((req.body.year2)%4)!= 0 && req.body.month2 == 2){
            if(req.body.date2 == 29 || req.body.date2 == 30 || req.body.date2 == 31){
                endTime.setDate(28);
            }
        }
        else{
            //set endDate
            if(month2 != 1 && month2 !=3 && month2 !=5 && month2!=7 && month2 !=8 && month2 !=10 && month2 !=12 && req.body.date2 == 31){
                endTime.setDate(30);
            }
            else endTime.setDate(req.body.date2);
        }
        endTime.setFullYear(req.body.year2);
        endTime.setHours(endHour, req.body.minute2, 0);
        //console.log("endTime" + endTime);
    }
    else {
        endTime = ""
    }

    // update event intro
    EventDetail.findById(req.body.eventId, function (err, event) {
        event.name = req.body.name;
        event.startTime = startTime;
        event.endTime = endTime;
        event.description = req.body.description;
        event.location = req.body.location;
        event.save(function (err) {
            if (!err) {

                // send notification to all users who related to this event
                var relatedPeople = Helper.findUsersRelatedToEvent(event);
                sendUpdateEventIntroToUsers(relatedPeople,req.session.passport.user,event.creator.userID,event._id,function(err,result){
                    // Nếu thành công gửi hàng về đồng bằng
//                    res.send(200, {idComment: idComment, dateCreated: sendDate} );
                    res.send(event);
                })
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
    EventDetail.findById(req.body.eventId, function (err, event) {
        event.announcement = req.body.announcement;
        event.save(function (err) {
            if (!err) {
                var relatedPeople = Helper.findUsersRelatedToEvent(event);
                console.log("Related " + JSON.stringify(relatedPeople));
                sendUpdateAnnouncementToUsers(relatedPeople,req.session.passport.user,event.creator.userID,event._id,function(err,result){
                    // Nếu thành công gửi hàng về đồng bằng
                    res.send(event.announcement);
                })
//                res.send(event);
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
    console.log("Update event's Note");
    console.log("Ses "+ JSON.stringify(req.session.passport));
    console.log("Req " + JSON.stringify(req.body));
    var userID = req.session.passport.user.id;
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
                res.send({'title':req.body.title,'content':req.body.content});
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
                res.send({'title':req.body.title,'content':req.body.content});
            } else {
                res.send(err);
            }
        });
    });
}



//==========================================================================================================================
// check Creator
// NghiaNV-14/3/2014
exports.checkCreator = function (req, res) {
    console.log("Check Creator")
    var isCreator = false;
    EventDetail.findById(req.body.eventId, function (err, event) {
        // If user are a member
        if(event.creator.userID == req.body.userID){
            isCreator = true;
        }
        else {
            isCreator = false;
        }
        res.send(isCreator);
    });
}



//==========================================================================================================================
// check Participate
// NghiaNV-14/3/2014
exports.checkParticipate = function (req, res) {
    console.log("Check Participate")
    var isParticipate = false;
    var isCreator = false;
    EventDetail.findById(req.body.eventId, function (err, event) {
        // If user are a member
        if(event.creator.userID == req.body.userID){
            isParticipate = true;
            isCreator = true;
        }
        else {
            if(!event.user){
                event.user = "";
            }
            for(var i= 0; i < event.user.length; i++){
                if(event.user[i].userID == req.body.userID && event.user[i].status == 'confirmed'){
                    isParticipate = true
                }
                else isParticipate = false;
            }
        }
        res.send({isCreator: isCreator, isParticipate: isParticipate});
    });
}



//==========================================================================================================================
// check Participate
// NghiaNV-14/3/2014
exports.checkIsNullEvent = function (req, res) {
    console.log("Check isNull event")
    var isNullEvent = false;
    EventDetail.findById(req.body.eventId, function (err, event) {
        // If user are a member
        if(event)
            if(event.isBanned == true){
                isNullEvent = true;
            }
            else isNullEvent = false;
        else{
            isNullEvent = true;
        }
        console.log("IsNullEvent " + isNullEvent);
        res.send(isNullEvent);
    });
}



//==========================================================================================================================
// AJAX hide event's post
//NghiaNV - 15/3/2014
exports.hide = function (req, res) {
    var eventId = req.body.eventId;
    var userId = req.session.passport.user.id;
    console.log("UserID: " + userId);
    console.log("eventID: " + eventId);

    // find user
    User.findOne({'_id': userId}, function (err, user) {
        if (err) {
            console.log("Err :" + err);
        }
        if(user){
            if(!user.hideList){
                console.log("ABC 1")
                user.hideList="";
            }
            var hideL = user.hideList.length;
            if (hideL == 0) {
                console.log("Bằng 0")
                User.update({'_id': userId}, {$push: {hideList: {'eventID': eventId}}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Sorry. You are not handsome enough to do this!');
                    }
                    else console.log("Hided");
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
    if (currentUser) {
        var findEvent = {$or: [
            {'creator.userID': userID},
            {
                $and: [
                    {'user.userID': userID},
                    {'user.status': {$in: ['confirmed']}}
                ]
            }
        ]}

        var returnEvents = [];
        EventDetail.find(findEvent).exec(function (err, events) {
            events.forEach(function (event) {
                var starTime = event.startTime;
                var endTime = event.endTime;
                starTime.setMonth((starTime.getMonth())-1);
                endTime.setMonth((endTime.getMonth())-1);
                var returnEvent = {
                    url: '/event/view/' + event._id,
                    title: event.name,
                    start: new Date(starTime),
                    end: new Date(endTime)
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
    // find the event request between this event and the current user
    EventRequest.findOne({'user':req.session.passport.user.id,'event':eventId},function(err, request){
        if(err) return res.send(200,{error:err});

        if(request){
            // the request is exist
            // there are 2 chances to get 'waiting' and 'need-confirm'
            if(!request.eventCreator){
                // it came from invite func
                return res.send(200, 'need-confirm');
            }else{
                // it came from join func
                return res.send(200, 'waiting');
            }
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
                            if(event.user[i].userID == req.session.passport.user.id){
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
                EventDetail.update({'_id': event}, {$pull: {'user': {'userID': user}}}, function (err) {
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
            EventDetail.update({'_id': eventId}, {$pull: {'user': {'userID': userId}}}, function (err) {
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
    var privacy = req.body.privacy;

    if(privacy.indexOf('c')==0){
        // it's the close community event
        EventDetail.findOne({'_id':eventId},function(err,event){
            if (err) {
                console.log(err);
                return res.send(200, {error:err});
            }

            if(event){
                // check if a request between event and user is exist
                EventRequest.findOne({'event': eventId, 'user': userId}, function (err, request) {
                    if (err) {
                        console.log(err);
                        return res.send(200, {error:err});
                    }

                    if (request) {
                        return res.send(200, 'waiting');
                    } else {
                        // send the owner of this event a request
                        var eventRequest = new EventRequest();

                        eventRequest.event = eventId;
                        eventRequest.user = userId;
                        eventRequest.eventCreator = event.creator.userID;
                            eventRequest.save(function (err, request) {
                                if (err) {
                                    console.log(err);
                                    return res.send(500, 'Something wrong just happened. Please try again.');
                                }

                                // add user to event's user list
                                User.findOne({'_id': userId}, function (err, user) {
                                    if (err) {
                                        console.log(err);
                                        return res.send(200, {error:err});
                                    }

                                    // initialize embedded user in user list
                                    var embeddedUser = {
                                        fullName: user.fullName,
                                        userID: user._id,
                                        username: user.usernameByProvider,
                                        avatar: user.avatarByProvider,
                                        status: 'waiting'
                                    };
                                    // add embedded user to event's user list
                                    EventDetail.update({'_id': eventId}, {$push: {user: embeddedUser}}, function (err) {
                                        if (err) {
                                            console.log(err);
                                            return res.send(200, {error:err});
                                        }

                                        // return joined
                                        return res.send('waiting');
                                    });
                                });
                            });
                    }
                });
            }else{
                return res.send(200, {error:'This event is no longer available'});
            }

        });
    }else{
        // it's the other event
        // user wouldn't wait to the event accept
        // add user to event's user list
        User.findOne({'_id': userId}, function (err, user) {
            if (err) {
                console.log(err);
                return res.send(200, {error:err});
            }

            // initialize embedded user in user list
            var embeddedUser = {
                fullName: user.fullName,
                userID: user._id,
                username: user.usernameByProvider,
                avatar: user.avatarByProvider,
                status: 'confirmed'
            };
            // add embedded user to event's user list
            EventDetail.update({'_id': eventId}, {$push: {user: embeddedUser}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.send(200, {error:err});
                }

                // return joined
                return res.send('joined');
            });
        });
    }
}

/**
 * thuannh
 * confirm event request
 *
 * @param req
 * @param res
 * @param next
 */
exports.confirmEventRequest = function(req, res, next){
    var userId = req.body.userId;
    var eventId = req.body.eventId;
    // find the request between this user and the event
    EventRequest.findOne({'user':userId,'event':eventId},function(err, request){
        if(err) next();

        if(request){
            // exist
            // delete this request
            request.remove(function(err){
                // change status of user in the user list of this event from 'waiting' to 'confirmed'
                EventDetail.update(
                    {'user.userID':userId},
                    {'$set':{
                        'user.$.status':'confirmed'
                    }}, function(err){
                        if(err) return res.send(200,{error:err});

                        return res.send(200, 'confirmed');
                    });
            });
        }else{
            return res.send(200, 'confirmed');
        }
    });


}

/**
 * thuannh
 * reject event request
 *
 * @param req
 * @param res
 * @param next
 */
exports.rejectEventRequest = function(req, res, next){
    var userId = req.body.user;
    var eventId = req.body.event;
    // find the request between this user and the event
    EventRequest.findOne({'user':userId,'event':eventId},function(err, request){
        if(err) next();

        if(request){
            // exist
            // delete this request
            request.remove(function(err){
                return res.send(200,'rejected');
            });
        }else{
            return res.send(200,'rejected');
        }
    });
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
    var candidates = req.body.friends.split(',');
    var invitors = req.body.invitors;

    if(!invitors) invitors = [];
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
    Helper.mergeArray(candidates,invitors);
    // send request
    var embeddedList = [];
    sendMultiRequest(candidates, invitors, candidates.length, eventId, embeddedList, function (err, embeddedList) {
        if (err) return next();
        // push is all into the event's user list
        EventDetail.update({'_id': eventId}, {$pushAll: {user: embeddedList}}, function (err) {
            if (err) {
                console.log('Error:  ' + err);
                return res.send(500, 'Something Wrong !', {eventID: eventId});
            }
            // Add Successful
            // add invitors
            // push is all into the event's invite list
            return res.send(200, embeddedList);
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
    var ids = JSON.parse(req.query.ids);
    var ownerId = req.params.ownerId;
    var hideList = [];
    // Tìm tất cả cách event của User
    if(ids){
        // parse hide list into objectId
        for(var i=0;i<ids.length;i++){
            var id = ids[i];
            ids[i] = new ObjectId(id);
        }
    }
    User.findOne({'_id': ownerId}, function (err, user) {
        if (err) console.log('Error: ' + err);
        if (!user.hideList) {
            user.hideList = "";
        }
        for (var i = 0; i < user.hideList.length; i++) {
            hideList.push(user.hideList[i].eventID)
        }
        if(ids){
            // merge with hidelist
            Helper.mergeArray(hideList,ids);
            // parse hide list into objectId
            for(var i=0;i<hideList.length;i++){
                var id = ''+ hideList[i];
                hideList[i] = new ObjectId(id);
            }
        }
        // Điều kiện tìm kiếm
        // + Event creator = bản thân
        // + Event có user.status = confirmed
        var findEvent =
        {'$and':
            [
                {'_id'  : {$nin: hideList}},
                {'isBanned':false},
                {'$or'  : [
                    {'creator.userID': ownerId},
                    {
                        $and: [
                            {'user.userID': ownerId},
                            {'user.status': {$in: ['confirmed']}}
                        ]
                    }
                ]}
            ]};

        if (user) {
            EventDetail.find(findEvent).sort('-lastUpdated').limit(5).exec(function (err, events) {
                if (err) console.log(err);
                return res.send(200, {events: events});
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
    if(inviteRightList.length>0){
        for (var i = 0; i < inviteRightList.length; i++) {
            var temp = inviteRightList[i];
            if (temp.indexOf(candidateId) > -1) {
                canInvite = true;
            }
        }
    }
    // find if this candidate has an request
    EventRequest.findOne({'user':candidateId,'event':eventId},function(err, request){
        if(err) return cb(err,null);

        if(!request){
            // send candidate a request
            var request = new EventRequest();
            request.user = candidateId;
            request.event = eventId;

            request.save(function (err) {
                if (err) return cb(err,null);

                // add user to event's user list
                User.findOne({'_id': candidateId}, function (err, user) {
                    if (err) return cb(err);

                    // initialize embedded user in user list
                    var embeddedUser = {
                        fullName: user.fullName,
                        userID: user._id,
                        username: user.usernameByProvider,
                        avatar: user.avatarByProvider
                    };
                    // notice that he can invite
                    embeddedUser.inviteRight = canInvite;
                    // add embedded user to event's user list
                    embeddedList.push(embeddedUser);

                    return sendMultiRequest(candidates,inviteRightList,total,eventId,embeddedList,cb);
                });
            });
        }else{
            return sendMultiRequest(candidates,inviteRightList,total,eventId,embeddedList,cb);
        }
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
    var sendDate = new Date();
    var updates = {
            $push: {
                'comment': {
                    _id: idComment,
                    userId: comment.userId,
                    username: comment.username,
                    fullName: comment.fullName,
                    avatar: comment.avatar,
                    content: comment.content,
                    datetime: sendDate
                }
            }
        };
    // Thêm Comment vào Event
    EventDetail.findOne({'_id':eventID},function(err, event){
        if (err) {
            console.log(err);
            res.send(500, 'Something Wrong !');
        }

        // push comment
        event.update(updates,function(err){
            if (err) {
                console.log(err);
                res.send(500, 'Something Wrong !');
            }

            // send notification to all users who related to this event
            var relatedPeople = Helper.findUsersRelatedToEvent(event);
            sendCommentNotificationToUsers(relatedPeople,req.session.passport.user,comment.userId,event._id,function(err,result){
                // Nếu thành công gửi hàng về đồng bằng
                res.send(200, {idComment: idComment, dateCreated: sendDate} );
            })
        })
    })
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
    EventDetail.update({'_id': eventID}, updates, function (err, event) {
        if (err) {
            console.log('Something Wrong');
            res.send(500, 'Something Wrong !');
        }
    });
    res.send(200);
}

/**
 * TrungNM - Upload Multiple File
 * URL:
 */
exports.multipleFileUpload = function (req, res){


}

/**
 * TrungNM - Upload Cover
 * URL: '/api/event/view/:id/uploadCover'
 */
exports.uploadCover = function(req, res, next){
    var file = req.files.file;
    var userID = req.session.passport.user.id;
    var eventID = req.body.eventID;
    // Tạo ra 1 id cho ảnh

    fsx.copy(file.path, 'public/img/events/cover/'+ userID + '_' + eventID + '.png' , function (err) {
        // Nếu có lỗi, thông báo
        if (err) {
            console.log('Error:  ' + err);
        }

        // Chuẩn bị Query để thêm comment vào event
        var updates = {
            $set: {
                'cover': '/img/events/cover/'+ userID + '_' + eventID + '.png'
            }
        };
        // Ghi vao database
        EventDetail.update({'_id': eventID }, updates, function (err) {
            if (err) {
                console.log(err);

                res.send(500, 'Something Wrong !');
            }

            fs.unlink(file.path, function(err){
                if (err) console.log(err);

            })

            res.send(200);
        });

        res.send(200);
    });

}

/**
 * TrungNM - crop Cover
 * URL: '/api/event/view/:id/cropCover'
 */

exports.cropCover = function(req, res, next){
    console.log(JSON.stringify(req.body));
    var selected = req.body.selected;
    var userID = req.session.passport.user.id;
    var cover = req.body.cover;
    console.log('Cover:   ' + cover);

    easyimg.crop(
        {
            src: './public' + cover, dst: './public' + cover,
            cropwidth:selected.w, cropheight:selected.h,
            gravity:'NorthWest',
            x:selected.x, y:selected.y
        },
        function(err, image) {
            if (err) throw err;
        }
    );
    res.send(200);
}

exports.getTimeshelfProfile = function(req,res,next){
    var ownerId = req.params.ownerId;

    User.findOne({'_id':ownerId},function(err,user){
        if(err) return res.send(200, {error:err});

        if(user){
            //Nghĩa thêm
            var numFriend = 0;
            for( var i =0; i< user.friend.length;i++){
                if(user.friend[i].isConfirmed == true){
                    numFriend += 1;
                }
            }
            var ownerMin = {
                userId      :   user._id,
                fullName    :   user.fullName,
                createDate  :   user.createDate,
                friendCount :   numFriend,
                avatar      :   user.avatarByProvider,
                username    :   user.usernameByProvider,
                report      :   user.report
            }
            return res.send(200, ownerMin);
        }else{
            return res.send(200, {});
        }
    });
}

/**
 * ThuanNH
 * send comment notifications
 *
 * @param relatedList
 * @param currUser
 * @param senderId
 * @param eventId
 * @param cb
 * @returns {*}
 */
function sendCommentNotificationToUsers(relatedList,currUser,senderId,eventId,cb){
    if(relatedList.length == 0){
        return cb(null,true);
    }
    if(!senderId || !eventId || !currUser){
        return cb('Invalid input',null);
    }
    var relatedPerson = relatedList[0];
    if(relatedPerson == currUser.id){
        // don't send a notification to the one who recently commented.
        // splice them
        relatedList.splice(0,1);
        // move next
        sendCommentNotificationToUsers(relatedList,currUser,senderId,eventId,cb);
    }else{
        // find this notification existed
        Notification.findOne({'owner':relatedPerson,'content.event':eventId,'type':'cmt'},function(err, notification){
            if(err) return cb(err, null);

            if(notification){
                // found
                if(notification.isRead){
                    // if it is read, then create new one
                    var notification = new Notification();
                    notification.owner = relatedPerson;
                    notification.type = 'cmt';
                    notification.content = {
                        sender: [{userId:senderId}],
                        event: eventId
                    }
                    notification.save(function(err){
                        if(err) return cb(err,null);
                        // splice them
                        relatedList.splice(0,1);
                        // move next
                        sendCommentNotificationToUsers(relatedList,currUser,senderId,eventId,cb);
                    });
                }else{
                    // if it isn't read, then update this
                    var isExist = false;
                    var updateQuery = {};
                    for(var i=0;i<notification.content.sender.length;i++){
                        if(notification.content.sender[i] == senderId){
                            isExist = true;
                            break;
                        }
                    }
                    if(isExist){
                        // update createDate
                        updateQuery = {
                            $set: {'createDate': new Date()}
                        }
                    }else{
                        // update sender and createDate
                        updateQuery = {
                            $set: {'createDate': new Date()},
                            $push: {'content.sender': {'userId': senderId}}
                        }
                    }
                    // update it now
                    notification.update(updateQuery,function(err){
                        if(err) return cb(err,null);
                        // splice them
                        relatedList.splice(0,1);
                        // move next
                        sendCommentNotificationToUsers(relatedList,currUser,senderId,eventId,cb);
                    });
                }
            }else{
                // not found
                // create new
                // send a notification
                var notification = new Notification();
                notification.owner = relatedPerson;
                notification.type = 'cmt';
                notification.content = {
                    sender: [{userId:senderId}],
                    event: eventId
                }
                notification.save(function(err){
                    if(err) return cb(err,null);
                    // splice them
                    relatedList.splice(0,1);
                    // move next
                    sendCommentNotificationToUsers(relatedList,currUser,senderId,eventId,cb);
                });
            }
        });
    }
}


/**
 * ThuanNH
 * send updateEventIntro notifications
 *
 * @param relatedList
 * @param currUser
 * @param senderId
 * @param eventId
 * @param cb
 * @returns {*}
 */
function sendUpdateEventIntroToUsers(relatedList,currUser,senderId,eventId,cb){
        if(relatedList.length == 0){
            return cb(null,true);
        }
        if(!senderId || !eventId || !currUser){
            return cb('Invalid input',null);
        }
        var relatedPerson = relatedList[0];
        if(relatedPerson == currUser.id){
            // don't send a notification to the one who recently commented.
            // splice them
            relatedList.splice(0,1);
            // move next
            sendUpdateEventIntroToUsers(relatedList,currUser,senderId,eventId,cb);
        }else{
            // find this notification existed
            Notification.findOne({'owner':relatedPerson,'content.event':eventId,'type':'uptIntro'},function(err, notification){
                if(err) return cb(err, null);

                if(notification){
                    // found
                    if(notification.isRead){
                        // if it is read, then create new one
                        var notification = new Notification();
                        notification.owner = relatedPerson;
                        notification.type = 'uptIntro';
                        notification.content = {
                            sender: [{userId:senderId}],
                            event: eventId
                        }
                        notification.save(function(err){
                            if(err) return cb(err,null);
                            // splice them
                            relatedList.splice(0,1);
                            // move next
                            sendUpdateEventIntroToUsers(relatedList,currUser,senderId,eventId,cb);
                        });
                    }else{
                        // if it isn't read, then update this
                        var isExist = false;
                        var updateQuery = {};
                        for(var i=0;i<notification.content.sender.length;i++){
                            if(notification.content.sender[i] == senderId){
                                isExist = true;
                                break;
                            }
                        }
                        if(isExist){
                            // update createDate
                            updateQuery = {
                                $set: {'createDate': new Date()}
                            }
                        }else{
                            // update sender and createDate
                            updateQuery = {
                                $set: {'createDate': new Date()},
                                $push: {'content.sender': {'userId': senderId}}
                            }
                        }
                        // update it now
                        notification.update(updateQuery,function(err){
                            if(err) return cb(err,null);
                            // splice them
                            relatedList.splice(0,1);
                            // move next
                            sendUpdateEventIntroToUsers(relatedList,currUser,senderId,eventId,cb);
                        });
                    }
                }else{
                    // not found
                    // create new
                    // send a notification
                    var notification = new Notification();
                    notification.owner = relatedPerson;
                    notification.type = 'uptIntro';
                    notification.content = {
                        sender: [{userId:senderId}],
                        event: eventId
                    }
                    notification.save(function(err){
                        if(err) return cb(err,null);
                        // splice them
                        relatedList.splice(0,1);
                        // move next
                        sendUpdateEventIntroToUsers(relatedList,currUser,senderId,eventId,cb);
                    });
                }
            });
        }
    }



/**
 * ThuanNH
 * send updateEventAnnouncement notifications
 *
 * @param relatedList
 * @param currUser
 * @param senderId
 * @param eventId
 * @param cb
 * @returns {*}
 */
function sendUpdateAnnouncementToUsers(relatedList,currUser,senderId,eventId,cb){
    if(relatedList.length == 0){
        return cb(null,true);
    }
    if(!senderId || !eventId || !currUser){
        return cb('Invalid input',null);
    }
    var relatedPerson = relatedList[0];
    if(relatedPerson == currUser.id){
        // don't send a notification to the one who recently commented.
        // splice them
        relatedList.splice(0,1);
        // move next
        sendUpdateAnnouncementToUsers(relatedList,currUser,senderId,eventId,cb);
    }else{
        // find this notification existed
        Notification.findOne({'owner':relatedPerson,'content.event':eventId,'type':'uptAnnoun'},function(err, notification){
            if(err) return cb(err, null);

            if(notification){
                // found
                if(notification.isRead){
                    // if it is read, then create new one
                    var notification = new Notification();
                    notification.owner = relatedPerson;
                    notification.type = 'uptAnnoun';
                    notification.content = {
                        sender: [{userId:senderId}],
                        event: eventId
                    }
                    notification.save(function(err){
                        if(err) return cb(err,null);
                        // splice them
                        relatedList.splice(0,1);
                        // move next
                        sendUpdateAnnouncementToUsers(relatedList,currUser,senderId,eventId,cb);
                    });
                }else{
                    // if it isn't read, then update this
                    var isExist = false;
                    var updateQuery = {};
                    for(var i=0;i<notification.content.sender.length;i++){
                        if(notification.content.sender[i] == senderId){
                            isExist = true;
                            break;
                        }
                    }
                    if(isExist){
                        // update createDate
                        updateQuery = {
                            $set: {'createDate': new Date()}
                        }
                    }else{
                        // update sender and createDate
                        updateQuery = {
                            $set: {'createDate': new Date()},
                            $push: {'content.sender': {'userId': senderId}}
                        }
                    }
                    // update it now
                    notification.update(updateQuery,function(err){
                        if(err) return cb(err,null);
                        // splice them
                        relatedList.splice(0,1);
                        // move next
                        sendUpdateAnnouncementToUsers(relatedList,currUser,senderId,eventId,cb);
                    });
                }
            }else{
                // not found
                // create new
                // send a notification
                var notification = new Notification();
                notification.owner = relatedPerson;
                notification.type = 'uptAnnoun';
                notification.content = {
                    sender: [{userId:senderId}],
                    event: eventId
                }
                notification.save(function(err){
                    if(err) return cb(err,null);
                    // splice them
                    relatedList.splice(0,1);
                    // move next
                    sendUpdateAnnouncementToUsers(relatedList,currUser,senderId,eventId,cb);
                });
            }
        });
    }
}


/**
 * ThuanNH
 * send updateEventLike notifications
 *
 * @param relatedList
 * @param currUser
 * @param senderId
 * @param eventId
 * @param cb
 * @returns {*}
 */
function sendUpdateLikeToUsers(relatedList,currUser,senderId,eventId,cb){
    if(relatedList.length == 0){
        return cb(null,true);
    }
    if(!senderId || !eventId || !currUser){
        return cb('Invalid input',null);
    }
    var relatedPerson = relatedList[0];
    if(relatedPerson == currUser.id){
        // don't send a notification to the one who recently commented.
        // splice them
        relatedList.splice(0,1);
        // move next
        sendUpdateLikeToUsers(relatedList,currUser,senderId,eventId,cb);
    }else{
        // find this notification existed
        Notification.findOne({'owner':relatedPerson,'content.event':eventId,'type':'uptLike'},function(err, notification){
            if(err) return cb(err, null);

            if(notification){
                // found
                if(notification.isRead){
                    // if it is read, then create new one
                    var notification = new Notification();
                    notification.owner = relatedPerson;
                    notification.type = 'uptLike';
                    notification.content = {
                        sender: [{userId:senderId}],
                        event: eventId
                    }
                    notification.save(function(err){
                        if(err) return cb(err,null);
                        // splice them
                        relatedList.splice(0,1);
                        // move next
                        sendUpdateLikeToUsers(relatedList,currUser,senderId,eventId,cb);
                    });
                }else{
                    // if it isn't read, then update this
                    var isExist = false;
                    var updateQuery = {};
                    for(var i=0;i<notification.content.sender.length;i++){
                        if(notification.content.sender[i] == senderId){
                            isExist = true;
                            break;
                        }
                    }
                    if(isExist){
                        // update createDate
                        updateQuery = {
                            $set: {'createDate': new Date()}
                        }
                    }else{
                        // update sender and createDate
                        updateQuery = {
                            $set: {'createDate': new Date()},
                            $push: {'content.sender': {'userId': senderId}}
                        }
                    }
                    // update it now
                    notification.update(updateQuery,function(err){
                        if(err) return cb(err,null);
                        // splice them
                        relatedList.splice(0,1);
                        // move next
                        sendUpdateLikeToUsers(relatedList,currUser,senderId,eventId,cb);
                    });
                }
            }else{
                // not found
                // create new
                // send a notification
                var notification = new Notification();
                notification.owner = relatedPerson;
                notification.type = 'uptLike';
                notification.content = {
                    sender: [{userId:senderId}],
                    event: eventId
                }
                notification.save(function(err){
                    if(err) return cb(err,null);
                    // splice them
                    relatedList.splice(0,1);
                    // move next
                    sendUpdateLikeToUsers(relatedList,currUser,senderId,eventId,cb);
                });
            }
        });
    }
}


/**
 * thuannh
 * report as spam
 *
 * @param req
 * @param res
 * @param next
 */
exports.report = function(req,res,next){
    if(!req.session.passport.user){
        return res.send(500,'Need authorize');
    }
    var targetId = req.params.target;
    var type = req.query.type;
    var currUser = req.session.passport.user.id;

    if(type=='event'){
        // he reported an event
        EventDetail.update({'_id':targetId},{$push:{report:{reporter:currUser}}}, {upsert:true}, function(err, event){
            if(err) return res.send(500,err);

            // reported
            return res.send(200,'reported');
        });
    }else{
        // he reported someone
        User.update({'_id':targetId},{$push:{report:{reporter:currUser}}},{upsert:true},function(err,user){
            if(err){
                console.log('err: ' + err);
                return res.send(500,err);
            }

            // reported
            return res.send(200,'reported');
        });
    }
}