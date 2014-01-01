/**
 * Created by Noir on 1/1/14.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var embeddedUserSchema = new Schema({
    username    :   String,
    fullName    :   String,
    avatar      :   String
});

module.exports = embeddedUserSchema;


