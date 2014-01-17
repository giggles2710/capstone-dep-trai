'use strict';

module.exports = function(app, passport, auth) {
    require('./routes/users/authRoute')(app, passport);
    // require các file route ở đây
    app.get('/', function(req, res, next){
        return res.render('index');
    });
};
