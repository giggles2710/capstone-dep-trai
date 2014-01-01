/*
*  Updated by Noir on 1/1/14
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmbeddedUser = require('./embeddedUser');

// update : remove schema minUser
var friendRequestSchema = new Schema({
	from:{
		type: Schema.ObjectId,
        ref: 'User',
		required:true
	},
	to:{
		type: Schema.ObjectId,
		ref: 'User',
		required: true
	},
	status:{
		type:String,
		default: 'NEW'
	},
	isRead:{
		type: Boolean,
		default: false
	}
});

// EXPORTS
var FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
module.exports = FriendRequest; // update : remove exports of model minUser