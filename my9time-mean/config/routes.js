'use strict';

module.exports = function(app, passport, auth) {
    require('./routes/users/authRoute')(app, passport);
    // require các file route ở đây
    app.get('/', function(req, res, next){
        console.log(JSON.stringify(req.session));

        return res.render('index');
    });
};
