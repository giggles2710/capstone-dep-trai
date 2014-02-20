/**
 * Created by Nova on 2/14/14.
 */
var homepageController = require('../../../app/controllers/events/eventControllerAPI');
module.exports = function(app){
    // show events
    // updated by ThuanNH
    app.get('/api/homepage',homepageController.listAll);
    // get timeshelf
    app.get('/api/timeshelf/:ownerId',homepageController.timeshelf);
    // like events
    app.post('api/like', homepageController.likeEvent);
    // share events
    app.post('api/share', homepageController.share);
    //hide event
    app.post('api/hide',homepageController.hide);
    //load more event
    app.post('api/loadMore', homepageController.loadMore);
    /**
     * thuannh
     * join event
     */
    app.put('/api/joinEvent',homepageController.joinEvent);
    /**
     * thuannh
     * cancel event request
     */
    app.put('/api/cancelEventRequest',homepageController.cancelEventRequest);
    /**
     * thuannh
     * quit event
     */
    app.put('/api/quitEvent',homepageController.quitEvent);
}