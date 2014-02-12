'use strict';

module.exports = function(app, passport, auth) {
    require('./routes/users/userRoute')(app, passport);
    // require các file route ở đây
    require('./routes/events/eventRoute')(app);
    /**
     * index route, send file index.html
     *
     * thuannh added
     */
    app.get('/', function(req, res, next){
        console.log('**** session:' + JSON.stringify(req.session));

        return res.render('index');
    });
};
