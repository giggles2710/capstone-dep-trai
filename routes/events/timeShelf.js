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
    // TODO: Chỉnh lại với đường dẫn là username
    app.get('/timeshelf', function(req, res){
        // Tìm tất cả cách event của User
        //TODO: Chỉnh lại tìm event User được mời
        EventDetail.find({'creator.userId': req.session.user.id}, function(err, events){
            if (err) console.log(err);
            res.render('event/timeShelf', {title: 'YOLOOOOO', events: events});
        })
    });

}