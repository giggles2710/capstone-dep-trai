
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var setting = require('./routes/users/setting');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');



var MongoStore = require('connect-mongo')(express);

var app = express();

// database connection
mongoose.connect('mongodb://localhost/my9time');

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views/TrungNM'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// Khởi tạo Session
app.use(express.cookieParser());
app.use(express.session({
    store: new MongoStore({
        url: 'mongodb://localhost/my9time'
    }),
    secret: 'bi-mat-cua-chung-ta'
}));
app.use(app.router);


// Test
app.configure(function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', setting.view);
// This is mine !

app.get('/view', setting.view);
app.get('/setting',setting.setting);

// Register
app.get('/signup',setting.signup);
app.post('/submitUser', setting.submitUser);

// Change Password
app.get('/changepass', setting.changePass);
app.post('/submitPass', setting.submitPass);


app.get('/delete/:userID', setting.delete);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));

});
