/**
 * Created by ConMeoMauDen on 13/02/2014.
 */

var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var Admin = require(path.join(HOME + "/models/admin"));
var helper = require(path.join(HOME + "/helpers/helper"));
var fs = require('fs');

// TODO: Code tìm tất cả các Admin
exports.getAllAdmins = function(req, res, next){

}

// TODO: Code tạo Admin
exports.createAdmin = function(req, res, next){

}

// TODO: Code tìm admin
exports.findOneAdmin = function(req, res, next){

}
