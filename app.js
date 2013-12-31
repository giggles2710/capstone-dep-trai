
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
require('./config/passport')(passport);

var MongoStore = require('connect-mongo')(express);

var app = express();

// database connection
mongoose.connect('mongodb://localhost/my9time');

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

// Uploaded image Temporary directory
app.use(express.bodyParser({uploadDir:'./public/tmp'}));

app.use(express.cookieParser());
app.use(express.session({
    store: new MongoStore({
        url: 'mongodb://localhost/my9time'
    }),
    secret: '123456789',
    maxAge: new Date(Date.now() + 3600000), // session timeout - for older version
    expires: new Date(Date.now() + 3600000) // session timeout - for later version of express
}));
// passport config
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// index
app.get('/', routes.index);

// ====================================================================================
// authentication routes ==============================================================
require('./routes/users/authentication')(app,passport);


// TrungNM Area - Do not Enter
// ====================================================================================
// Setting routes =====================================================================
require('./routes/users/setting')(app,passport);


// ====================================================================================
// event routes ==============================================================
require('./routes/events/eventController')(app,passport);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
