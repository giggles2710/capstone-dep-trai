
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var authRoutes = require('./routes/users/authentication');
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

app.use(express.cookieParser());
app.use(express.session({
    store: new MongoStore({
        url: 'mongodb://localhost/my9time'
    }),
    secret: 'bi-mat-cua-chung-ta'
}));
// passport config
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// index
app.get('/', routes.index);
// index
app.get('/loginTest', routes.loginTest);
// authentication
app.get('/login', authRoutes.login);
app.post('/login', authRoutes.authenticate);

app.get('/auth/facebook', passport.authenticate('facebook',{scope: 'email'}));
app.get('/auth/facebook/callback', passport.authenticate('facebook'),
function(req, res){
    // authenticated
    req.session.user = {
        id: req.user._id,
        fullName: req.user.fullName,
        provider: 'facebook'
    }
    res.redirect('/profileTest');
});

// register
app.get('/signup', authRoutes.signup);
app.post('/signup', authRoutes.submitUser);
// profile
app.get('/profileTest', authRoutes.profileTest);
// log out
app.get('/logout', authRoutes.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
