var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var Url = mongoose.SchemaTypes.Url;

var Notification = new Schema({
	link: {
		type: String,
		required: true
	},
	usename: {
		type: String,
		required: true
	},
	avatar: {
		type: Buffer,
		required: false
	},
	content: {
		type: String,
		required: true
	},
	time: {
		type: Date,
        default: Date.now
	},
	read: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Notification', Notification);