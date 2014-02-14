/**
 * Created by Nova on 2/14/14.
 */
var homepageController = require('../../../app/controllers/events/eventControllerAPI');
module.exports = function(app){
    // show events
    app.get('/api/homepage',homepageController.listAll);
    // like events
    app.post('api/like', homepageController.likeEvent);
    // share events
    app.post('api/share', homepageController.share);
    //hide event
    app.post('api/hide',homepageController.hide);
    //load more event
    app.post('api/loadMore', homepageController.loadMore);
}