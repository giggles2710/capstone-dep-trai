var root = __dirname,
	express = require("express"),
	mongoose = require('mongoose'),
	app = express(),
	ejs = require('ejs'),
	eventDetail = require("./models/eventDetail"),
	eventDetail = require("./models/calendarEvent"),
	user = require("./models/user");
	
mongoose.connect('mongodb://localhost/database');

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
	var event, calendar;
	
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
					inviteRight: theRight,
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

var http = require('http'),
	server = http.createServer(app);
server.listen(8080);