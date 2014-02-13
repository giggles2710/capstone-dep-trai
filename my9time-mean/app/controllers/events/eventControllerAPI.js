/**
 * Created by Nova on 2/11/14.
 */
var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , eventDetail = require(path.join(HOME + "/models/eventDetail"))
    , fs = require('fs'),
    im = require('imagemagick')
    , formidable = require('formidable')
user = require(path.join(HOME + "/models/user"));
var mongoose = require('mongoose');
var User = require(path.join(HOME + "/models/user"));
var EventDetail = require(path.join(HOME + "/models/eventDetail"))
var helper = require(path.join(HOME+ "/../helper/event.Helper"))



//=============================================================================
// Nghĩa- Recode 10/2/2014
// GET: Get event page
exports.getEvent = function(req,res,next,id){
    console.log("Get event");
    eventDetail.findOne({'_id': id}, function (err, event) {
        if (err) res.send(err);
        if (event) {
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
    event = req.currEvent;
//    event.privacy = helper.formatPrivacy(event.privacy);
//    event.startTime = helper.formatDate(event.startTime);
//    event.endTime = helper.formatDate(event.endTime);
//    console.log("Show event :" + event);
    res.jsonp(event);
}


//=============================================================================
// Nghĩa- Recode 10/2/2014
//    Create event
exports.createEvent = function(req,res,id){
    var userId = req.body.userId;
    console.log('id : ' +userId)
    User.findOne({'_id': userId}).exec(function (err, user) {
        console.log("im herre");
        console.log("user: "+user);
        event = new eventDetail({
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
        console.log("tên ta nè " + req.body.name);
        console.log("start nè " + req.body.start);
        event.save(function (err) {
            console.log("save");
            if (!err) {
                res.send({id:event._id});
            } else {
                res.send(err);
            }
        });
    });


//=============================================================================
// Nghĩa- Recode 10/2/2014
//    update event
    exports.editEvent = function(req,res){
        var currEvent = req.currEvent;
        console.log("id" + currEvent._id);
        var newEvent = req.event;
        console.log("req.event: "+ req.event);
        eventDetail.findById(currEvent._id, function (err, event) {
            event.name = newEvent.name;
            event.startTime = newEvent.startTime;
            event.endTime = newEvent.endTime;
            event.description = newEvent.description;
            event.location = newEvent.location;
            event.privacy = newEvent.privacy;
            //event.creator = newEvent.creator;
            //event.like = newEvent.like;
            //event.user = newEvent.user;
            //event.comment = newEvent.comment;
            //event.photo = newEvent.photo;
            //event.announcement = newEvent.announcement;
                event.save(function (err) {
                if (!err) {
                    res.send({id:event._id});
                } else {
                    res.send(err);
                }
            });
    })
    }


//=============================================================================
// Nghĩa- Recode 12/2/2014
//    like event
    exports.like = function(req,res){

    }

//===============================================================================
// Nghĩa- Recode 12/2/2014
//    for validate
    exports.checkUnique = function(req, res, next){
        var str = req.body.target;
        var type = req.body.type;
        str.toLowerCase();
        var query = (type=='username')?{'local.username':str}:{'email':str};

        console.log('target: ' + str +' type: '+type+' query: '+JSON.stringify(query));
        User.count(query , function(err, n){
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
}


