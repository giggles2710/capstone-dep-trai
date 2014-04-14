/**
 * Created by Noir on 3/26/14.
 */

// module
var fsx = require('fs-extra');
// models
var Admin = require("../../models/admin")
    , User = require("../../models/user")
    , EventDetail = require("../../models/eventDetail")

/**
 * thuannh
 * make a sample database for admin
 * referrence to db-admin.json
 *
 * @param req
 * @param res
 * @param next
 */
exports.init = function(req,res,next){
    fsx.readFile('db-admin.json','utf-8',function(err, rawMenu){
        if(err)
            console.log("** Read file error: " + err);
        else{
            var data = JSON.parse(rawMenu);
            for(var i=0;i<data.length;i++){
                new Admin({
                    email: data[i].email,
                    username: data[i].username,
                    password: data[i].password
                }).save(function(err){
                        if(err){
                            console.log("** " + err);
                            res.send('ERR');
                        }
                    });
            }
            Admin.find(function(err, admins){
                if(!err){
                    //console.log('admins: ' + JSON.stringify(admins));
                    res.send(admins);
                }
            });
        }
    });
}

/**
 * thuannh
 * get reported user
 *
 * @param req
 * @param res
 * @param next
 */
exports.getReportedUser = function(req,res,next){
    if(req.session.passport.user){
        if(req.session.passport.user.isAdmin){
            // is admin
            User.find({'$where':"this.report && this.report.length > 0"},function(err, users){
                if(err) return res.send(500,err);

                var clientUsers = [];
                if(users.length > 0){
                    for(var i=0;i<users.length;i++){
                        var clientUser = {};
                        clientUser.userId = users[i]._id;
                        clientUser.username = users[i].usernameByProvider;
                        clientUser.email = users[i].emailByProvider;
                        clientUser.createDate = users[i].createDate;
                        clientUser.report = users[i].report;
                        clientUser.isBanned = users[i].isBanned;
                        // push it
                        clientUsers.push(clientUser);
                    }
                }
                return res.send(200,clientUsers);
            });
        }
    }
}

/**
 * thuannh
 * get reported event
 *
 * @param req
 * @param res
 * @param next
 */
exports.getReportedEvent = function(req,res,next){
    if(req.session.passport.user){
        if(req.session.passport.user.isAdmin){
            // is admin
            EventDetail.find({'$where':"this.report && this.report.length > 0"},function(err, events){
                if(err) return res.send(500,err);

                var clientEvents = [];
                if(events.length > 0){
                    for(var i=0;i<events.length;i++){
                        var clientEvent = {};
                        clientEvent.id = events[i]._id;
                        clientEvent.name = events[i].name;
                        clientEvent.creator = {
                            username: events[i].creator.username,
                            userId: events[i].creator.userID
                        };
                        clientEvent.lastUpdated = events[i].lastUpdated;
                        clientEvent.report = events[i].report;
                        clientEvent.isBanned = events[i].isBanned;
                        // push it
                        clientEvents.push(clientEvent);
                    }
                }
                return res.send(200,clientEvents);
            });
        }
    }
}

/**
 * thuannh
 * get bad word event
 *
 * @param req
 * @param res
 * @param next
 */
exports.getBadWordEvent = function(req,res,next){
    if(req.session.passport.user){
        if(req.session.passport.user.isAdmin){
            // is admin
            EventDetail.find({'badWordNumber':{'$gt':0}},function(err, events){
                if(err) return res.send(500,err);

                var clientEvents = [];
                if(events.length > 0){
                    for(var i=0;i<events.length;i++){
                        var clientEvent = {};
                        clientEvent.id = events[i]._id;
                        clientEvent.name = events[i].name;
                        clientEvent.creator = {
                            username: events[i].creator.username,
                            userId: events[i].creator.userID
                        };
                        clientEvent.lastUpdated = events[i].lastUpdated;
                        clientEvent.badWordNumber = events[i].badWordNumber;
                        clientEvent.badWordLocation = events[i].badWordLocation;
                        clientEvent.isBanned = events[i].isBanned;
                        clientEvent.lastUpdated = events[i].lastUpdated;
                        // push it
                        clientEvents.push(clientEvent);
                    }
                }
                return res.send(200,clientEvents);
            });
        }
    }
}

/**
 * thuannh
 * active
 *
 * @param req
 * @param res
 * @param next
 */
exports.active = function(req,res,next){
    var type = req.query.type;
    var targetId = req.params.targetId;

    if(type=='e'){
        // ban event
        EventDetail.update({'_id':targetId},{'$set':{isBanned:false}},function(err){
            if(err) return res.send(500, err);

            return res.send(200);
        });
    }else{
        // ban user
        User.update({'_id':targetId},{'$set':{isBanned:false}},function(err){
            if(err) return res.send(500, err);

            return res.send(200);
        });
    }
}

/**
 * thuannh
 * ban
 *
 * @param req
 * @param res
 * @param next
 */
exports.ban = function(req,res,next){
    var type = req.query.type;
    var targetId = req.params.targetId;

    if(type=='e'){
        // ban event
        EventDetail.update({'_id':targetId},{'$set':{isBanned:true}},function(err){
            if(err) return res.send(500, err);

            return res.send(200);
        });
    }else{
        // ban user
        User.update({'_id':targetId},{'$set':{isBanned:true}},function(err){
            if(err) return res.send(500, err);

            return res.send(200);
        });
    }
}