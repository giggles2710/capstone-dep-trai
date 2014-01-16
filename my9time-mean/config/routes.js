'use strict';

module.exports = function(app, passport, auth) {
    // require các file route ở đây
    app.get('/', function(req, res, next){
        return res.render('index');
    });
};
