'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    logger = require('mean-logger'),
    io = require('socket.io');

/**
 * file chính của server
 * thứ tự khai báo rất quan trọng
 */

// load các tùy chỉnh
// cài đặt môi trường của app - dev/test/production
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// khởi tạo các biến hệ thống
// load từ các module khác
var config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

// kết nối với database
// var db = mongoose.connect(config.db);

// duyệt models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

// load cài đặt cho passport
require('./config/passport')(passport);

var app = express();

// load cài đặt cho express
require('./config/express')(app, passport, db);

// load định hướng
require('./config/routes')(app, passport, auth);

// chạy server
var port = process.env.PORT || config.port;
var server = app.listen(port);
var io = require('socket.io').listen(server);

// load socket
require('./config/sockets')(io);
console.log('My9Time started on port ' + port + ' and on '+process.env.NODE_ENV+' environment ...');

// khởi tạo logger
logger.init(app, passport, mongoose);

// expose module
module.exports = app;

