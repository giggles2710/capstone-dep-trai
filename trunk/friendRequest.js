var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// SCHEMA
var minUserSchema = new Schema({
	fullName:{
		type: String,
		required: true,
	},
	username:{
		type: String,
		required: true
	},
	avatar:{
		type: String, 
		required: true
	}
});

var eventRequestSchema = new Schema({
	user:{
		type: minUserSchema,
		required:true,
		default: false
	},
	status:{
		type:String,
		required:true
	},
	isRead:{
		type: Boolean,
		default: false
	}
});

// EXPORTS
var MinUser = mongoose.model('MinUser', minUserSchema);
var EventRequest = mongoose.model('EventRequest', eventRequestSchema);

module.exports = MinUser;
module.exports = EventRequest;