var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var Url = mongoose.SchemaTypes.Url;

var Notification = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref:    'User'
    },
	sender:{
        username: {
            type: String
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        avatar: {
            type: String
        },
        link:{
            type: String
        }
    },
	content: {
		type: String,
		required: true
	},
	createDate: {
		type: Date,
        default: Date.now
	},
	isRead: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Notification', Notification);