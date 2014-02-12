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
    //app.put('/event/update/:id', eventController.editEvent);
}

