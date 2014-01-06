var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , eventDetail = require(path.join(HOME + "/models/eventDetail"))
    , helper = require(path.join(HOME + "/helpers/event.Helper"))
    , fs = require('fs'),
    im = require('imagemagick'),
//	, formidable = require('formidable')
//	, util = require('until')
    user = require(path.join(HOME + "/models/user"));


//CheckMe - Them User Model - Các bạn coi lại user và User là 1 để hồi sửa, sau khi đã thống nhất sửa thanh User
//TrungNM
var User = require(path.join(HOME + "/models/user"));
var EventDetail = require(path.join(HOME + "/models/eventDetail"))

module.exports = function (app, passport) {

    //=============================================================================
    // GET: /event/create - Show create event page
    app.get('/event/create', function (req, res) {
        User.findOne({'_id': req.session.user.id}, function (err, user) {
            if (err) return console.log(err);
            if (user) {
                res.render("event/addEvent.ejs", {friend: user.friend});

            }
        });
    });

    //=============================================================================
    // POST: /event/create - Create event action
    // TrungNM - Recode ncc !
    app.post('/event/create', function (req, res) {
        var event;
        var selected = req.body.userId;
        if (!Array.isArray(selected)) {
            // kiểm tra nếu argument đưa về từ client là chuỗi hay là mảng
            // nếu là chuỗi, thì push vào cái mảng
            var temp = selected;
            selected = [];
            selected.push(temp);
        }
        // TODO: Làm cái selectedInvite
        var selectedInvite = req.body.invite.split(",");
        var userArray = new Array();

        // Tìm người dùng hiện tại
        User.findOne({'_id': req.session.user.id}).exec(function (err, user) {
            // Nếu có chọn invite User
            console.log('Do dai:   ' + selected[0]);
            if (selected[0]) {
            if (selected) {
                // TODO: thử dùng cái find = $or thử nhá, sau khi search nó trả về 1 list các user, kiểm tra lại xem thằng nào k trùng.
                userArray = findFriendInArray(0, selected, null, function (err, friends) {
                    if (err) return console.log(err);
                    userArray = friends;

                    if (friends) {
                        // Create new Event - Save to Database
                        event = new eventDetail({
                            name: req.body.name,
                            startTime: req.body.start,
                            endTime: req.body.end,
                            description: req.body.description,
                            location: req.body.location,
                            privacy: req.body.privacy,
                            user: userArray,
                            creator: {
                                avatar: user.avatar,
                                fullname: user.fullName,
                                username: user.local.username,
                                userId: user._id
                            }
                        });

                        event.save(function (err) {
                            if (!err) {
                                // Successful - chuyen qua trang coi Detail
                                return res.redirect('/event/' + event._id);
                            } else {
                                console.log(err);
                                return res.send(err);
                            }
                        });

                    }
                });
            }
            } else {
                // Nếu không có invite User thì vẫn tạo thôi chứ gì
                // Create new Event - Save to Database
                event = new eventDetail({
                    name: req.body.name,
                    startTime: req.body.start,
                    endTime: req.body.end,
                    description: req.body.description,
                    location: req.body.location,
                    privacy: req.body.privacy,
                    creator: {
                        avatar: user.avatar,
                        fullname: user.fullName,
                        username: user.local.username,
                        userId: user._id
                    }
                });
                event.save(function (err) {
                    if (!err) {
                        // Successful - chuyển qua trang coi Detail
                        return res.redirect('/event/' + event._id);
                    } else {
                        console.log(err);
                        return res.send(err);
                    }
                });
            }
        });
    });

    //============================================================================
    // POST: /event/update/:id - Update event action

    app.post('/event/update/:id', function (req, res) {
        console.log("alo");
        return eventDetail.findById(req.params.id, function (err, event) {
            console.log("event:" + req.params.id);
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
    });

    //=======================================================================================
    // Get: /event/uploadImage - Show upload photo page
    app.get('/event/uploadImage', function (req, res) {
        res.render("event/uploadImage.ejs");

    });

    //=======================================================================================
    // POST: /event/uploadImage - Upload photo action
    app.post('/event/uploadImage', function (req, res) {

        /// If there's an error
        if (!req.files.avatar.name) {
            console.log("There was an error")
            res.redirect('event/create');
        }
        // Resize avatar to 500x500
        im.resize({
            srcPath: req.files.avatar.path,
            dstPath: './public/uploaded/event/' + req.files.avatar.name,
            width: 500
        }, function (err, stdout, stderr) {
            if (err) {
                console.log('File Type Error !');
                res.redirect('/event/create');
            }
            console.log("ok ?");

            // Save link to database
            var photo = new Array();
            var pic = '/uploaded/event/' + req.files.avatar.name;
            photo.push(pic);

            var updates = {
                $set: {'photo': photo}
            };
            eventDetail.findById('52c110ef68e573040500000c', function (err, event) {
                event.update(updates, function (err) {
                    if (err) return console.log('Error');
                })
            });
            // Delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(req.files.avatar.path, function () {
                if (err) throw err;
            });

            res.redirect('event/view/52c110ef68e573040500000c');
        });


    });

    // Show files
    app.get('/event/uploadImage/:file', function (req, res) {
        file = req.params.file;
        var img = fs.readFileSync("./public/uploaded/" + file);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');

    });

    // TrungNM - Recode
    // =================================================================================
    // GET: /event/:eventID - View eventdetail
    app.get('/event/:id', function (req, res) {
        var eventID = req.params.id;
        EventDetail.findOne({'_id': eventID}, function (err, events) {
            if (err) console.log('Error: ' + err);
            if (events) {
                User.findOne({'_id': req.session.user.id}, function (err, user) {
                    res.render('event/eventDetail', {title: 'View Event Detail', events: events, user: user});
                })
            }
        });
    });


    // =================================================================================
    // PUT: /event/:eventID - Add new User to Event
    app.put('/event/:id', function (req, res) {
        var eventID = req.body.eventID;
        var userID = req.body.userID;
        var inviteRight = req.body.inviteRight;
        var choice = false;
        if (inviteRight === 'yes') {
            choice = true;
        }
        // Find User by ID
        User.findOne({'_id': userID}, function (err, user) {
            // Prepare to Die !
            var updates = {
                $push: {
                    user: {
                        "userID": user._id,
                        "avatar": user.avatar,
                        "fullname": user.fullName,
                        "username": user.local.username,
                        "status": "w",
                        "inviteRight": choice
                    }
                }
            }
            // Add user to database
            EventDetail.update({'_id': eventID}, updates, function (err) {
                if (err) {
                    console.log(err);
                    res.send(500, 'Something Wrong !', {eventID: eventID});
                }
                //TODO: coi lại cái Ajax eventDetail
                // Add Successful
                res.send(200, 'OK', {eventID: eventID, user: user});
            });
        })
    });

    // =================================================================================
    // PUT: /event/photoUpload - Upload Photo to Event
    app.post('/event/photoUpload', function (req, res) {
        console.log(req.files.image);

    });
}

// Code của Thuận
function findFriendInArray(pos, sourceList, returnList, cb) {
    if (!returnList) returnList = [];

    User.findOne({'_id': sourceList[pos]}, function (err, user) {
        if (err) return cb(err);

        if (user) {
            returnList.push({
                username: user.local.username,
                userID: user._id,
                fullname: user.fullName,
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
