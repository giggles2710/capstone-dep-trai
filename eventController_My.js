var root = __dirname,
	express = require("express"),
	mongoose = require('mongoose'),
	app = express(),
	ejs = require('ejs'),
	eventDetail = require("./eventDetail"),
	user = require("./user");
	
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
	app.use(express.static(root + "/public"));
	
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
	event = new eventDetail({
		name: req.body.name,
		startTime: req.body.start,
		endTime: req.body.end,
		description: req.body.description,
		location: req.body.location,
		privacy: req.body.privacy,
		creator: {
			fullname: currentUser.fullname,
			username: currentUser.username
		}
	});
	
	event.save(function(err) {
        if (!err) {
            console.log("created");
			return res.redirect('/event/view', {id: event._id});
        } else {
            console.log(err);
			return res.send(err);
        }
    });
});

var http = require('http'),
	server = http.createServer(app);
server.listen(8080);