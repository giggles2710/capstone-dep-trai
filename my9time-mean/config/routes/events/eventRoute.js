/**
 * Created by Nova on 2/11/14.
 */
var eventController = require('../../../app/controllers/events/eventControllerAPI');
module.exports = function(app, passport){
    // show events
    app.get('/event/:id',eventController.showEvent);
    app.param('id',eventController.getEvent)
    // create events
    app.post('/event/create', eventController.createEvent);

}

