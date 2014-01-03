var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EmbeddedUser = new Schema ({
	username: String,
	fullname: String,
	avatar: String
});

var EventDetail = new Schema ({
	name: String,
	startTime: Date,
    endTime: Date,
	description: String,
	like: [EmbeddedUser],
	user: [{avatar: String, fullname:String, username: String, userId :{type:Schema.Types.ObjectId,ref:'User'}, status: String, inviteRight: Boolean, note: {title: String, content: String, lastUpdate: Date}}],
	comment: [{username: String, fullname: String, avatar: String, content: String, datetime: Date}],
	photo: [String],
	announcement: String,
	tag: [String],
	share: [EmbeddedUser],
	creator: {avatar: String, fullname:String, username: String, note: {title: String, content: String, lastUpdate: Date}},
	lastUpdated: {
        type: Date,
        default: Date.now
    },
	privacy: String, 
	file: String,
	cover: String,
	location: String,
	alarm: {
		type: Boolean,
		default: false,
	}
});

module.exports = mongoose.model('EventDetail', EventDetail);