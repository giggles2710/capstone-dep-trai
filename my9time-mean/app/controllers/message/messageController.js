/**
 * Created by ConMeoMauDen on 14/02/2014.
 */

var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var Message = require(path.join(HOME + "/models/message"));
var helper = require(path.join(HOME + "/helpers/helper"));
var fs = require('fs');

// TODO: Code tìm tất cả các Messages của user
exports.getAllMessages = function(req, res, next){

}

// TODO: Code tạo message
exports.createMessage = function(req, res, next){

}

// TODO: Code tìm 1 message
exports.findOneMessage = function(req, res, next){

}
