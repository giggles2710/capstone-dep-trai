/**
 * Created by motconvit on 12/18/13.
 */
var schemaEventRequest = {
    read:    {
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
}