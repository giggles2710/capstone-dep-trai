'use strict';

module.exports = function(app, passport, auth) {
    require('./routes/users/userRoute')(app, passport);
    // require các file route ở đây
    require('./routes/events/eventRoute')(app);
    require('./routes/calendar/calendarRoute')(app);
    require('./routes/homepage/homepageRoute')(app);
    require('./routes/admin/adminRoute')(app);
    /**
     * index route, send file index.html
     *
     * thuannh added
     */
    app.get('/', function(req, res, next){
        return res.render('index');
    });
};
