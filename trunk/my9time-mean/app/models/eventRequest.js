/**
 * Created by motconvit on 12/18/13.
 * Updated by thuannh on 17/2/14
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var eventRequestSchema = new Schema({
    event:{
        type: Schema.Types.ObjectId,
        ref: 'EventDetail',
        required: true
    },
    eventCreator:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    status:   {
        type: String,
        default: 'NEW'
    },
    isRead:    {
        type: Boolean,
        default: false,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false,
        required: true
    }
});

// exports
module.exports = mongoose.model('EventRequest', eventRequestSchema);