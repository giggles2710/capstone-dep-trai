/**
 * Created by Nova on 2/14/14.
 */
var homepageController = require('../../../app/controllers/events/eventControllerAPI');
var passport = require('../../../config/passport');

module.exports = function(app){
    // show events
    // updated by ThuanNH
    app.get('/api/homepage',homepageController.listAll);

    //TrungNM: - Code for Mobile
    app.post('/mobile/homepage', homepageController.listAllMobile);


    // get timeshelf
    app.get('/api/timeshelf/:ownerId',homepageController.timeshelf);

    //TrungNM: - Code for Mobile
    app.post('/mobile/timeshelf',homepageController.timeshelfMobile);


//    //islike
//    app.get('/api/isLike', homepageController.isLike);
//    //like
//    app.put('/api/like', homepageController.like);
//    //unlike
//    app.put('/api/unLike', homepageController.unLike);
//
//    // share events
//    app.post('api/share', homepageController.share);
//    //hide event
//    app.post('api/hide',homepageController.hide);
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
    /**
     * thuannh
     * quit event
     */
    app.put('/api/confirmEventRequest',homepageController.confirmEventRequest);
    /**
     * thuannh
     * get event request status
     */
    app.get('/api/getEventRequestStatus/:eventId',homepageController.checkEventRequestStatus);

    /**
     * TrungNM - Code for Mobile
     * get event request status
     */
    app.post('/mobile/getEventRequestStatus',homepageController.checkEventRequestStatusMobile);
    /**
     * thuannh
     * reject event
     */
    app.put('/api/rejectEventRequest',homepageController.rejectEventRequest);
    /**
     * thuannh
     * get timeshelf profile
     */
    app.get('/api/getTimeshelfProfile/:ownerId',homepageController.getTimeshelfProfile);
    /**
     * thuannh
     * report
     */
    app.put('/api/report/:target',homepageController.report);
    /**
     * thuannh
     * search on homepage
     */
    app.get('/api/search',homepageController.instantSearch);
}