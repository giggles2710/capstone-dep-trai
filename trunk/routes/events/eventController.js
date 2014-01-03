

var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , eventDetail = require(path.join(HOME + "/models/eventDetail"))
    , helper = require(path.join(HOME + "/helpers/event.Helper"))
    , fs = require('fs')
//	, formidable = require('formidable')
//	, util = require('until')
	, user = require(path.join(HOME + "/models/user"));


//CheckMe - Them User Model
//TrungNM
var UserTrungNM = require(path.join(HOME + "/models/user"));
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

/*
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
*/


module.exports = function(app, passport) {

//=========================================================================================


	//=============================================================================
	// create new event page
	app.get('/event/create', function (req, res) {
        UserTrungNM.findOne({'_id': req.session.user.id}, function (err, user) {
            if (err) return console.log(err);

            if (user) {
                res.render("event/addEvent.ejs", {friend: user.friend});

            }
        });
	});

	//=============================================================================
	// create new event post
	app.post('/event/create', function (req, res) {
		var event, calendar;
        // Lấy current User
        var currentUser = req.session.user;
        var selected = req.body.user.split(",");
		var selectedInvite = req.body.invite.split(",");
		var userArray = new Array();
        var friend = new Array();
        friend.push({Name: 'Trung'}, {Name: 'Minh'});
        currentUser.friend = friend;

//		for (var i = 0; i < selected.length; i++) {
//			for (var j = 0; j < currentUser.friend.length; j++) {
//				if (selected[i] == currentUser.friend[j].username) {
//
//					var theRight = false;
//					for (var k = 0; k < selectedInvite.length; k++) {
//						if (selectedInvite[k] == currentUser.friend[j].username) {
//							theRight = true;
//							break;
//						}
//					}
//					userArray.push({
//						//avatar: ...
//						username: currentUser.friend[j].username,
//						fullname: currentUser.friend[j].fullname,
//                        userId  : currentUser.friend[j]._id,
//						status: "w",
//						//w: wait for acceptance
//						//m: member
//						//a: ask to join
//						inviteRight: theRight
//					});
//					break;
//				}
//			}
//		}

		event = new eventDetail({
			name: req.body.name,
			startTime: req.body.start,
			endTime: req.body.end,
			description: req.body.description,
			location: req.body.location,
			privacy: req.body.privacy,
			user: friend,
			creator: {
				//avatar: ...
				//fullname: req.session.user.fullName,
				//username: req.session.user.username
                //fullname: currentUser.fullname,
                //username: currentUser.username,
                // TODO- Nghĩa sửa lại nè :
                userId  : req.session.user.id
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
		
		event.save(function(err) {
			if (!err) {
				console.log("created1");
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
	});


    // TrungNM - Recode
    // =================================================================================
    // GET: /event/:eventID - View TimeShelf
	app.get('/event/:id', function (req, res){
        var eventID = req.params.id;
        console.log('Event ID:  ' + eventID);
        EventDetail.findOne({'_id': eventID}, function(err, events){
            if (err) console.log('Error: ' + err);
            if (events){
                res.render('event/eventDetail', {title: 'View Event Detail', events: events});
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
	app.get('/event/uploadImage/:file', function (req, res){
		file = req.params.file;
		var img = fs.readFileSync("./public/uploaded/" + file);
		res.writeHead(200, {'Content-Type': 'image/jpg' });
		res.end(img, 'binary');

	});
}