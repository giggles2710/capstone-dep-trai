/**
 * Created by Nova on 12/24/13.
 */
var root = __dirname,
    express = require("express"),
    mongoose = require('mongoose'),
    app = express(),
    ejs = require('ejs'),
    eventDetail = require("./models/eventDetail"),
    user = require("./models/user");
    mongoose.connect('mongodb://localhost/database');

var helper = require("./helpers/event.Helper");
// for upload image;
var fs = require('fs');
var formidable = require('formidable');
var util = require('until');



//hard code to demo
var currentUser = new user({
    username: "mynhh",
    password: "6512",
    email: "mynhhse90018@fpt.edu.vn",
    fullname: "My Nguyen",
    birthday: "2013/12/05",
    gender: 'female',
    aboutMe: "abc",
    isBanned: false,
    friend:[
        {
            username: "nghianv",
            fullname: "Nghia Ngo"
        },
        {
            username: "trungnm",
            fullname: "Trung Nguyen"
        },
        {
            username: "namth",
            fullname: "Nam Thai"
        },
        {
            username: "minhtn",
            fullname: "Minh Tran"
        },
        {
            username: "thuannh",
            fullname: "Thuan Nguyen"
        }]
});

app.configure(function() {
    app.use(express.bodyParser({uploadDir:'./public/tmp'}));
    app.set('view options', {layout: false});
    app.use(express.static(__dirname + '/public'));

    //instead of bodyParser
    app.use(express.json());
    app.use(express.urlencoded());

    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', root + "/views/event");

app.get('/event/create', function (req, res) {
    res.render("addEvent.ejs", { friends: currentUser.friend });
});

app.post('/event/create', function (req, res) {
    var event;

    var selected = req.body.user.split(",");
    var selectedInvite = req.body.invite.split(",");
    var userArray = new Array();

    for (var i = 0; i < selected.length; i++) {
        for (var j = 0; j < currentUser.friend.length; j++) {
            if (selected[i] == currentUser.friend[j].username) {

                var theRight = false;
                for (var k = 0; k < selectedInvite.length; k++) {
                    if (selectedInvite[k] == currentUser.friend[j].username) {
                        theRight = true;
                        break;
                    }
                }
                userArray.push({
                    //avatar: ...
                    username: currentUser.friend[j].username,
                    fullname: currentUser.friend[j].fullname,
                    status: "w",
                    //w: wait for acceptance
                    //m: member
                    //a: ask to join
                    inviteRight: theRight
                });
                break;
            }
        }
    }

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
            fullname: currentUser.fullname,
            username: currentUser.username
        }
    });


    event.save(function(err) {
        if (!err) {
            console.log("created1");
        } else {
            console.log(err);
            return res.send(err);
        }
    });

    return res.redirect('/event/view/'+event._id);
    //return res.send(event);
});

//=============================================================================
// view detail

app.get('/event/view/:id', function (req, res){
    return eventDetail.findById(req.params.id, function (err, event) {
        if (!err) {
            event.privacy = helper.formatPrivacy(event.privacy);
            var sTime = helper.formatDate(event.startTime);
            var eTime = helper.formatDate(event.endTime);
            return res.render("viewEvent.ejs", { event: event ,sTime : sTime , eTime :eTime});
        } else {
            return console.log(err);
        }
    });
});


//============================================================================
// update event

app.post('/event/update/:id', function (req, res){
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
        event.save(function(err) {
            if (!err) {
                console.log("updated");
                return res.redirect('/event/view/'+event._id);
            } else {
                console.log(err);
                return res.send(err);
            }
        });
    });
});

//=======================================================================================
// upload image
app.get('/event/uploadImage', function (req, res){
    res.render("uploadImage.ejs");

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
app.get('/event/uploadImage/:file', function (req, res){
    file = req.params.file;
    var img = fs.readFileSync("./public/uploaded/" + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');

});




//===========================================================================================
var http = require('http'),
    server = http.createServer(app);
server.listen(8080);