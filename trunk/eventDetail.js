var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventDetail = new Schema ({
	name: String,
	startTime: Date,
    endTime: Date,
	description: String,
	like: [{username: String, fullname: String}],
	user: [{avatar: String, fullname:String, username: String, status: Boolean, note: {content: String, lastUpdate: Date}}],
	comment: [{username: String, fullname: String, avatar: String, content: String, datetime: Date}],
	photo: [{photo: String}],
	announcement: String,
	tag: [{username: String}],
	inviteRight: [{username: String}],
	share: [{username: String, fullname: String, avatar: String}],
	creator: [{username: String, fullname: String, avatar: String}],
	lastUpdated: Date,
	privacy: String, 
	file: String,
	cover: String,
	location: String,
	alarm: Boolean
});

module.exports = mongoose.model('EventDetail', EventDetail);