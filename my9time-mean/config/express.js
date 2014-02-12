'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    engine = require('ejs-locals'),
    config = require('./config');

module.exports = function(app, passport, db) {
    app.set('showStackError', true);

    // thông thường express trả về file html không có /n,
    // nếu sử dụng dòng này, sẽ trả về có xuống dòng.
    app.locals.pretty = true;

    // nên được đặt trước express.static
    // sử dụng để đảm bảo mọi output đều phải được nén lại (tối ưu băng thông)
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // cấp bậc xếp loại từ 0-9, 0 là không nén, 9 là nén tốt nhất nhưng sẽ 
        // chậm nhất
        level: 9
    }));

    // chỉ sử dụng logger ở môi trường dev
    if (process.env.NODE_ENV === 'development') {
        app.use(express.logger('dev'));
    }

    // đặt đường dẫn cho views, template engine và layout mặc định
    // Set views path, template engine and default layout
    app.engine('ejs', engine);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'ejs');

    // cho phép dùng json
    app.enable("jsonp callback");

    app.configure(function() {
        // sử dụng cookie
        app.use(express.cookieParser());

        // để có thể sử dụng body parsing vs body
        // nên được đặt trước methodOverride
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.methodOverride());

        // Express/Mongo lưu trữ session
        app.use(express.session({
            secret: config.sessionSecret,
            store: new mongoStore({
                db: db.connection.db,
                collection: config.sessionCollection
            })
        }));

        // hỗ trợ flash message
        app.use(flash());

        // helpers động
        app.use(helpers(config.app.name));

        // sử dụng session của passport
        app.use(passport.initialize());
        app.use(passport.session());

        // router nên được đặt ở cuối cùng
        app.use(app.router);
        
        // fav icon và các folder static
        app.use(express.favicon());
        app.use(express.static(config.root + '/public'));

        // Assume "not found" in the error msgs is a 404. this is somewhat
        // silly, but valid, you can do whatever you like, set properties,
        // use instanceof etc.
        app.use(function(err, req, res, next) {
            // Treat as 404
            if (~err.message.indexOf('not found')) return next();

            // Log it
            console.error(err.stack);

            // Error page
            res.status(500).render('500', {
                error: err.stack
            });
        });

        // Assume 404 since no middleware responded
        app.use(function(req, res, next) {
//            res.status(404).render('404', {
//                url: req.originalUrl,
//                error: 'Not found'
//            });
            if(res.status(404)){
                console.log('bug');
            }

            return res.render('index');
        });

    });
};