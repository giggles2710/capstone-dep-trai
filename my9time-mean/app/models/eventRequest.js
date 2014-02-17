/**
 * Created by motconvit on 12/18/13.
 * Updated by thuannh on 17/2/14
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var eventRequestSchema = new Schema({
    isRead:    {
        type: Boolean,
        required: true
    },
    time:   {
        type: Date,
        required: true
    },
    status:   {
        type: String,
        required: false
    },
    type:   {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

// exports
module.exports = mongoose.model('EventRequest', eventRequestSchema);