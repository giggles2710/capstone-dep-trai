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
var fs = require('fs'); // for upload image;

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
    // get the temporary location of the file
    //var imageName = req.files.file.name
    //console.log("name: "+imageName);
    var tmp_path = req.files.file.path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/uploaded/' + nghia + '.png';
    console.log(target_path);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
        //res.redirect("event/uploadImage/" + imageName);
        /* For saving to db
         *************
         *************
         */
    });
});

//app.post('/event/uploadImage', function(req, res) {
//
//    fs.readFile(req.files.image.path, function (err, data) {
//
//        var imageName = req.files.image.name
//
//        /// If there's an error
//        if(!imageName){
//
//            console.log("There was an error")
//            res.redirect("/event/uploadImage");
//            res.end();
//
//        } else {
//            var newPath = "./public/uploaded/" + imageName+'.png';
//
//            /// write file to uploads folder
//            fs.writeFile(newPath, data, function (err) {
//                res.redirect("event/uploadImage/" + imageName);
//
//
//            /* For saving to db
//                *************
//                *************
//            */
//            });
//        }
//    });
//});

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