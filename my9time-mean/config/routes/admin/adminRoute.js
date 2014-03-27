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

    app.get('/api/getReportedEvent',adminCtrl.getReportedEvent);

    app.get('/api/getReportedUser',adminCtrl.getReportedUser);

    app.put('/api/ban/:targetId',adminCtrl.ban);

    app.put('/api/active/:targetId',adminCtrl.active);
}