/**
 * Created by Nova on 2/11/14.
 */
var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , eventDetail = require(path.join(HOME + "/models/eventDetail"))
    , helper = require(path.join(HOME + "/helpers/event.Helper"))
    , fs = require('fs'),
    im = require('imagemagick')
    , formidable = require('formidable')
//	, util = require('until')
user = require(path.join(HOME + "/models/user"));
var mongoose = require('mongoose');

//CheckMe - Them User Model - Các bạn coi lại user và User là 1 để hồi sửa, sau khi đã thống nhất sửa thanh User
//TrungNM
var User = require(path.join(HOME + "/models/user"));
var EventDetail = require(path.join(HOME + "/models/eventDetail"))


//=============================================================================
// Nghĩa- Recode 10/2/2014
// GET: Get event page
exports.getEvent = function(req,res,next,id){
    eventDetail.findOne({'_id': id}, function (err, event) {
        if (err) res.send(err);
        if (event) {
            req.event = event;
            next();
        }
    });
}


//================================================================================================
//Nghia- 10/2/2014
// show event
exports.showEvent = function(req,res){
    event = req.event;
    res.jsonp(event);
}


//=============================================================================
// Nghĩa- Recode 10/2/2014
//    Create event
exports.createEvent = function(req,res,id){
    var userId = req.userId;
    User.findOne({'_id': userId}).exec(function (err, user) {
        event = new eventDetail({
            name: req.body.name,
            startTime: req.body.start,
            endTime: req.body.end,
            description: req.body.description,
            location: req.body.location,
            privacy: req.body.privacy,
            creator: {
                avatar: user.avatar,
                fullName: user.fullName,
                username: user.local.username,
                userID: user._id
            }
        });
        event.save(function (err) {
            if (!err) {
                res.jsonp(event._id);
            } else {
                res.jsonp(err);
            }
        });
    });


    //=============================================================================
// Nghĩa- Recode 10/2/2014
//    update event
    exports.createEvent = function(req,res,id){
        return eventDetail.findById(id, function (err, event) {
            event.name = req.body.name;
            event.startTime = req.body.startTime;
            event.endTime = req.body.endTime;
            event.description = req.body.description;
            event.location = req.body.location;
            event.privacy = req.body.privacy;
            event.creator = req.creator;
            event.like = req.body.like;
            event.user = req.body.user;
            event.comment = req.body.comment;
            event.photo = req.body.photo;
            event.announcement = req.body.announcement;
            event.save(function (err) {
                if (!err) {
                    console.log("updated");
                    return res.redirect('/event/view/' + event._id);
                } else {
                    console.log(err);
                    return res.send(err);
                }
            });
        });
    };
;
}


