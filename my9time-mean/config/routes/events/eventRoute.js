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
    //isShare
    app.post('/api/isShare',eventController.isShare);
    //share
    app.put('/api/share',eventController.share);
    // invite friends to event
    app.put('/api/invite', eventController.invite);
    //update event intro
    app.put('/api/updateEventIntro',eventController.updateEventIntro);
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


