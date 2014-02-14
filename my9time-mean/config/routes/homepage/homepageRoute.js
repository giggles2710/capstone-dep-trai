/**
 * Created by Nova on 2/14/14.
 */
var homepageController = require('../../../app/controllers/events/eventControllerAPI');
module.exports = function(app){
    // show events
    app.get('/api/homepage',homepageController.listAll);
}