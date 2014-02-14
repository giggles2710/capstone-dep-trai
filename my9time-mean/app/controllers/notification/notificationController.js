/**
 * Created by ConMeoMauDen on 14/02/2014.
 */

var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var Notification = require(path.join(HOME + "/models/notification"));
var helper = require(path.join(HOME + "/helpers/helper"));
var fs = require('fs');

// TODO: Code tìm tất cả các Notifications của user
exports.getAllNotifications = function(req, res, next){

}

// TODO: Code tạo message
exports.createNotification = function(req, res, next){

}

// TODO: Code tìm 1 message
exports.findOneNotification = function(req, res, next){

}
