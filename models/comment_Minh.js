/**
 * Created by motconvit on 1/2/14.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

    var comment = new Schema ({username: String, fullname: String, avatar: String, content: String, datetime: Date});
    var Comment = mongoose.model('comment', comment);
    module.exports.Comment = Comment;



