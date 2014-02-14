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
var EventDetail = require(path.join(HOME + "/models/eventDetail"))
var helper = require(path.join(HOME+ "/../helper/event.Helper"))
var _ = require ('lodash');




//=============================================================================
// Nghĩa- Recode 10/2/2014
// GET: Get event page
exports.getEvent = function(req,res,next,id){
    console.log("Get event");
    EventDetail.findOne({'_id': id}, function (err, event) {
        if (err) res.send(err);
        if (event) {
            event.privacy = helper.formatPrivacy(event.privacy);
            event.startTime = helper.formatDate(event.startTime);
            event.endTime = helper.formatDate(event.endTime);
            console.log("Privacy:  "+ event.privacy);
            req.currEvent = event;
            //console.log("request event: "+ req.event);
            next();
        }
    });
}


//================================================================================================
//Nghia- 10/2/2014
// show event
exports.showEvent = function(req,res){
    console.log("Show event :");
    event = req.currEvent;
    res.jsonp(event);
}


//=============================================================================
// Nghĩa- Recode 10/2/2014
//    Create event
exports.createEvent = function(req,res,id){
    var userId = req.body.userId;
    console.log('id : ' +userId)
    User.findOne({'_id': userId}).exec(function (err, user) {
        console.log("Create Event");
        event = new EventDetail({
            name: req.body.name,
            startTime: req.body.start,
            endTime: req.body.end,
            description: req.body.description,
            location: req.body.location,
            privacy: req.body.privacy,
            creator: {
                //avatar: user.avatar,
               // fullName: user.fullName,
                username: user.local.username,
                userID: user._id
            }
        });
        event.save(function (err) {
            console.log("save");
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
    exports.editEvent = function(req,res){
        var currEvent = req.currEvent;
        console.log("id" + currEvent._id);
        currEvent = _.extend(currEvent,req.body);
        currEvent.save(function(err){
            if(err){
                return res.send('users/signup');
            }
            else{
                res.jsonp(currEvent);
            }
        })


//        EventDetail.findById(currEvent._id, function (err, event) {
//            event.name = newEvent.name;
//            event.startTime = newEvent.startTime;
//            event.endTime = newEvent.endTime;
//            event.description = newEvent.description;
//            event.location = newEvent.location;
//            event.privacy = newEvent.privacy;
//            //event.creator = newEvent.creator;
//            //event.like = newEvent.like;
//            //event.user = newEvent.user;
//            //event.comment = newEvent.comment;
//            //event.photo = newEvent.photo;
//            //event.announcement = newEvent.announcement;
//                event.save(function (err) {
//                if (!err) {
//                    res.send({id:event._id});
//                } else {
//                    res.send(err);
//                }
//            });
//    })
    }


//=============================================================================
// Nghĩa- Recode 12/2/2014
//    like event
    exports.like = function(req,res){

    }

//===============================================================================
// Nghĩa- Recode 12/2/2014
//    for validate
    exports.checkUniqueName = function(req, res, next){
        var str = req.body.target;
        str.toLowerCase();
        var query = {'name':str};

        console.log('target: ' + str +'query:'+JSON.stringify(query));
        EventDetail.count(query , function(err, n){
            if(err) return console.log(err);

            if(n<1){
                // doesn't exist
                return res.send(200, true);
            }else{
                // existed
                return res.send(500, false);
            }
        });
    };

//===============================================================================
// Nghĩa- Recode 13/2/2014
//    for update Image
    exports.uploadImage = function(req,res){
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
                        if (!err){
                            res.jsonp(event);
                        };
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

    exports.like = function(req, res,next){
    var currEvent = req.currEvent;
        //TODO : dùng session ở server ?
    var userID = req.session.user.id;
    console.log('Like Function');
    console.log('EventID:   ' + currEvent._id);
    EventDetail.findOne(currEvent._id, function(err, event){
        event.likes(userID, function(err){
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
// get all event relate to current User
exports.listAll = function (req, res) {
    //TODO: session ?
    var currentUser = req.session.user;
    var userID = currentUser.id;
    var friend = [];
    var hideList=[];
    if (currentUser) {
        User.findOne({'_id': req.session.user.id}, function (err, user) {
                for (var i = 0; i < user.friend.length; i++) {
                    friend.push(user.friend[i].userId)
                }
                for(var i =0; i < user.hideList.length; i++){
                    hideList.push(user.hideList[i].eventID)
                }
                // Tìm User và USer Friends --> array các ID

                var findFriend = {
                    $and:[
                        {'id': {$nin:hideList}},
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
                        }]
                }

                EventDetail.find(findFriend).sort('-lastUpdated').limit(2).exec(function (err, events) {
                    res.render('event/home', {title: user.fullName, events: events, user: user});
                });

            }
        )
    }
}