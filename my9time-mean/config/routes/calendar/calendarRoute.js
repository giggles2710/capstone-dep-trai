/**
 * Created by Nova on 2/17/14.
 */
var CalendarController = require('../../../app/controllers/events/eventControllerAPI');
module.exports = function(app){
    // show all events
    app.get('/api/calendar',CalendarController.getAll);
    // edit events
    //app.put('/api/calendar/:id', CalendarController.editEvent);

    // TrungNM: Code get Calendar for Mobile
    app.get('/mobile/calendar/:id',CalendarController.getAllMobile);

}