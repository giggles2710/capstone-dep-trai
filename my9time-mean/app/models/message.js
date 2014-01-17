// Mongoose initialize:
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
// Model declaration:

var FromSchema = new Schema({
	fullname: String,
	username: String,
	avatar  : String
});

var ToSchema = new Schema({
	fullname: String,
	username: String,
	avatar  : String
});

var messageSchema = new Schema({
	content: String,
	from   : [FromSchema],
	to	   : [ToSchema]
});

module.exports = mongoose.model('Message', messageSchema);







