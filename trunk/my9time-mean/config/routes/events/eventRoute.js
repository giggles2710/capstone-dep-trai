/**
 * Created by Nova on 2/11/14.
 */
var eventController = require('../../../app/controllers/events/eventControllerAPI');
module.exports = function(app){
    // show events
    app.get('/api/event/:id',eventController.showEvent);
    app.param('id',eventController.getEvent)
    // create events
    app.post('/api/event', eventController.createEvent);
    // edit events
    app.put('/api/event/:id', eventController.editEvent);
    //check unique
    app.post('/api/checkUniqueName', eventController.checkUniqueName);
    //like
    app.put('/api/like/', eventController.likeEvent);
    //share
    app.put('/api/share',eventController.share);

}

