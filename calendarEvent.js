/**
 * Created by motconvit on 12/18/13.
 */
var schemaCalendarEvent = {
    detailID:    {
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
}

