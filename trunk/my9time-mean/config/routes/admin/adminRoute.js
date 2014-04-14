/**
 * Created by ConMeoMauDen on 14/02/2014.
 */
'use strict'
var adminCtrl = require('../../../app/controllers/admins/adminCtrl');

module.exports = function(app, passport){
    /**
     * thuannh
     * init database for admin
     */
    app.get('/api/initAdmin',adminCtrl.init);

    /**
     * thuannh
     * get reported event
     */
    app.get('/api/getReportedEvent',adminCtrl.getReportedEvent);

    /**
     * thuannh
     * get reported users
     */
    app.get('/api/getReportedUser',adminCtrl.getReportedUser);

    /**
     * thuannh
     * get events which contain bad words
     */
    app.get('/api/getBadWordEvent',adminCtrl.getBadWordEvent);

    /**
     * thuannh
     * ban
     */
    app.put('/api/ban/:targetId',adminCtrl.ban);

    /**
     * thuannh
     * active
     */
    app.put('/api/active/:targetId',adminCtrl.active);
}