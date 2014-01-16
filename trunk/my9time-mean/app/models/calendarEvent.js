var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CalendarEvent = new Schema ({
    detailID:    {
        type: String,
        required: true
    },
	username: {
		type: String,
		required: true
	},
	name: {
        type: String,
        required: true
    },
    startTime:   {
        type: Date,
        required: true
    },
    endTime:   {
        type: Date,
        required: true
    },
    colour:   {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('CalendarEvent', CalendarEvent);

