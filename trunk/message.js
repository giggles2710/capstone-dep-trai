// Mongoose initialize:
var mongoose = require ('mongoose');
mongoose.connect('mongodb://127.0.0.1/test');
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

var MessageSchema = new Schema({
	content: String,
	from   : [FromSchema],
	to	   : [ToSchema]
});







