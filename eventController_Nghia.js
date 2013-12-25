/**
 * Created by Nova on 12/24/13.
 */
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var routes = require('./routes');
var eventDetail = require("./eventDetail");
var user = require("./user");

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// for testing
app.configure(function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

// view
app.set('views', path.join(__dirname, 'views/event'));
app.set('view engine', 'ejs');

// This is our job
app.get('/', routes.index);

// view detail
app.get('/event/view/:id', function (req, res){
    return eventDetail.findById(req.params.id, function (err, event) {
        if (!err) {
            return res.send(event);
        } else {
            return console.log(err);
        }
    });
});

// update
app.put('/event/update/:id', function (req, res){
    return eventDetail.findById(req.params.id, function (err, event) {
        event.name = req.body.name;
        event.statTime = req.body.startTime;
        event.endTime = req.body.endTime;
        event.description = req.body.description;
        event.location = req.body.location;
        event.privacy = req.body.privacy;
        event.save(function(err) {
            if (!err) {
                console.log("updated");
                return res.redirect('/event/view', {id: event._id});
            } else {
                console.log(err);
                return res.send(err);
            }
        });
    });
});

