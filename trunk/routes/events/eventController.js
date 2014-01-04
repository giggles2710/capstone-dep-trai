var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , eventDetail = require(path.join(HOME + "/models/eventDetail"))
    , helper = require(path.join(HOME + "/helpers/event.Helper"))
    , fs = require('fs')
//	, formidable = require('formidable')
//	, util = require('until')
    , user = require(path.join(HOME + "/models/user"));


//CheckMe - Them User Model - Các bạn coi lại user và User là 1 để hồi sửa, sau khi đã thống nhất sửa thanh User
//TrungNM
var User = require(path.join(HOME + "/models/user"));
var EventDetail = require(path.join(HOME + "/models/eventDetail"))


//=========================================================================================
// Nghia đã tạm thời ẩn phần hard code để lấy session ra.

//hard code to demo
//var currentUser = new user({
//    username: "mynhh",
//    password: "6512",
//    email: "mynhhse90018@fpt.edu.vn",
//    fullname: "My Nguyen",
//    birthday: "2013/12/05",
//    gender: 'female',
//    aboutMe: "abc",
//    isBanned: false,
//    friend:[
//        {
//            username: "nghianv",
//            fullname: "Nghia Ngo"
//        },
//        {
//            username: "trungnm",
//            fullname: "Trung Nguyen"
//        },
//        {
//            username: "namth",
//            fullname: "Nam Thai"
//        },
//        {
//            username: "minhtn",
//            fullname: "Minh Tran"
//        },
//        {
//            username: "thuannh",
//            fullname: "Thuan Nguyen"
//        }]
//});

module.exports = function (app, passport) {

    //=============================================================================
    // create new event page
    app.get('/event/create', function (req, res) {
        User.findOne({'_id': req.session.user.id}, function (err, user) {
            if (err) return console.log(err);
            if (user) {
                res.render("event/addEvent.ejs", {friend: user.friend});

            }
        });
    });

    //=============================================================================
    // create new event post
    app.post('/event/create', function (req, res) {
            var event;
            var selected = req.body.user.split(",");
            var selectedInvite = req.body.invite.split(",");
            var userArray = new Array();

            // Nếu có chọn User
            if (selected) {
                // Tìm từng User để lấy thông tin
                for (var i = 0; i < selected.length; i++) {
                    User.findOne({'_id': selected[i]}, function (err, friend) {
                        console.log('Username:   ' + friend.local.username);

                        // Thêm thông tin Friend vào userArray
                        userArray.push({
                            username: friend.local.username,
                            userID: friend._id,
                            fullname: friend.fullName,
                            avatar: friend.avatar,
                            // TODO: Code lại cái inviteRight
                            inviteRight: true,
                            status: "w"
                            //w: wait for acceptance
                            //m: member
                            //a: ask to join
                        });
                        // TODO: ĐCM, ra khỏi chỗ này cái userArray ko dùng đc.
                    });
                }
                console.log(userArray);
            }


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
                    //avatar: ...
                    //fullname: req.session.user.fullName,
                    //username: req.session.user.username
                    //fullname: currentUser.fullname,
                    //username: currentUser.username,
                    // TODO- Nghĩa sửa lại nè :
                    userId: req.session.user.id
                }
            });


            /*
             ???
             calendar = new CalendarEvent({
             detailID: event._id,
             username: event.creator.username,
             name: event.name,
             startTime: event.startTime,
             endTime: event.endTime,
             colour: req.body.color
             });
             */

            event.save(function (err) {
                if (!err) {
                    /*
                     rollback???
                     calendar.save(function(err) {
                     if (!err) {
                     console.log("created2");
                     } else {
                     console.log(err);
                     return res.send(err);
                     }
                     });
                     */
                } else {
                    console.log(err);
                    return res.send(err);
                }
            });

            //return res.redirect('/event/view', {id: event._id});
            return res.send(event);
        }
    )
    ;


    // TrungNM - Recode
    // =================================================================================
    // GET: /event/:eventID - View eventdetail
    app.get('/event/:id', function (req, res) {
        var eventID = req.params.id;
        EventDetail.findOne({'_id': eventID}, function (err, events) {
            if (err) console.log('Error: ' + err);
            if (events) {
                res.render('event/eventDetail', {title: 'View Event Detail', events: events});
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
                res.send(200, 'OK', {eventID: eventID});

            });


        })
    });


    //============================================================================
    // update event

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
    // upload image
    app.get('/event/uploadImage', function (req, res) {
        res.render("event/uploadImage.ejs");

    });

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
}