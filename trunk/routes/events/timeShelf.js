/**
 * Created by ConMeoMauDen on 03/01/2014.
 */

var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var EventDetail = require(path.join(HOME + "/models/eventDetail"));

module.exports = function (app) {

    // =================================================================================
    // GET: /:userID - View TimeShelf
    app.get('/timeshelf', function(req, res){
        EventDetail.find({'creator.userId': req.session.user.id}, function(err, events){
            if (err) console.log(err);
            console.log(events);
            res.render('event/timeShelf', {title: 'YOLOOOOO', events: events});

        })
    });

}