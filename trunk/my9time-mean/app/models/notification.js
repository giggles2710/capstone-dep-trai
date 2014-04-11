var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var Url = mongoose.SchemaTypes.Url;

// ************************** content of Friend Request
//{
//    sender: {
//        username: 'String',
//        avatar : 'String',
//        userId : 'String'
//    }
//}

var Notification = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref:    'User'
    },
	content: {
		type: Schema.Types.Mixed,
		required: true
	},
	createDate: {
		type: Date,
        default: Date.now
	},
	isRead: {
		type: Boolean,
		default: false
	},
    type:{
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = mongoose.model('Notification', Notification);