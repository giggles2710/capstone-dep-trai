/**
 * Created by Nova on 2/11/14.
 */
var eventController = require('../../../app/controllers/events/eventControllerAPI');
module.exports = function(app){
    // show events
    app.get('/api/event/:eventId',eventController.showEvent);
    app.param('eventId',eventController.getEvent)
    // create events
    app.post('/api/event', eventController.createEvent);
    // edit events
    app.put('/api/event/:eventId', eventController.editEvent);
    //check unique
    app.post('/api/checkUniqueName', eventController.checkUniqueName);
    //like
    app.put('/api/like/', eventController.likeEvent);
    //share
    app.put('/api/share',eventController.share);
    // invite friends to event
    app.put('/api/invite', eventController.invite);
    //update event intro
    app.put('/api/updateEventIntro',eventController.updateEventIntro);
    //update event announcement
    app.put('/api/updateAnnouncement',eventController.updateEventAnnouncement);
    //update event announcement
    app.post('/event/uploadImage',eventController.uploadImage);
}


