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
    //islike
    app.get('/api/isLike', eventController.isLike);
    //like
    app.put('/api/like', eventController.like);
    //unlike
    app.put('/api/unLike', eventController.unLike);
    //isHighlight
    app.post('/api/isHighlight',eventController.isHighlight);
    //highlight
    app.put('/api/highlight',eventController.highlight);
    // unHighlight
    app.put('/api/unHighlight',eventController.unHighlight);
    //isShare
    app.post('/api/isShare',eventController.isShare);
    //share
    app.put('/api/share',eventController.share);
    //hide
    app.put('/api/hideEvent',eventController.hide);
    // invite friends to event
    app.put('/api/invite', eventController.invite);
    //get event intro
    app.get('/api/getEventIntro',eventController.getEventIntro);
    //update event intro
    app.put('/api/updateEventIntro',eventController.updateEventIntro);
    //get event announcement
    app.get('/api/getAnnouncement',eventController.getAnnouncement);
    //update event announcement
    app.put('/api/updateAnnouncement',eventController.updateEventAnnouncement);
    //update note of creator
    app.put('/api/updateNoteCreator',eventController.updateNoteCreator);
    //update note of user
    app.put('/api/updateNoteUser',eventController.updateNoteUser);
    //update event IMAGE
    app.post('/event/uploadImage',eventController.uploadImage);
    //check creator
    app.post('/api/checkCreator',eventController.checkCreator);
    // check paticipate
    app.post('/api/checkParticipate',eventController.checkParticipate);
    // get all recent Event
    app.post('/api/getRecentEvent',eventController.getRecentEvent);
    // check isNullEvent
    app.post('/api/checkIsNullEvent',eventController.checkIsNullEvent);
    /**
     * TrungNM - Comment Part
     */
    //Add comment
    app.post('/api//event/view/:id/addComment',eventController.addComment);

    //Remove comment
    app.post('/api//event/view/:id/removeComment',eventController.removeComment);

    /**
     * TrungNM - Cover Part
     */
    // Upload cover
    app.post('/api/event/view/:id/uploadCover',eventController.uploadCover);

    // Crop cover
    app.post('/api/event/view/:id/cropCover',eventController.cropCover);

}


