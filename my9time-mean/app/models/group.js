/**
 * Created by ConMeoMauDen on 02/01/2014.
 *
 */

// Mongoose initialize:
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path'),
    HOME = path.normalize(__dirname + '/..');

var groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    listUser: [{
        type: String
    }]
});


groupSchema.pre('save', function(next){

});

module.exports = mongoose.model('Group', groupSchema);



