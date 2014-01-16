var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var Email = mongoose.SchemaTypes.Email;

var Admin = new Schema({
	email: {
		type: String,
		required: true,
		index: { unique: true }
	},
	username: {
		type: String,
		required: true,
		index: { unique: true }
	},
	password1: {
		type: String,
		required: true
	},
	password2: {
		type: String,
		required: true
	}
});



module.exports = mongoose.model('Admin', Admin);