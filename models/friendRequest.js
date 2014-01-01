/*
*  Updated by Noir on 1/1/14
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmbeddedUser = require('./embeddedUser');

// update : remove schema minUser
var friendRequestSchema = new Schema({
	user:{
		type: Schema.ObjectId,
        ref: 'EmbeddedUser',
		required:true
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
var FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
module.exports = FriendRequest; // update : remove exports of model minUser