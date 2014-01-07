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
    app.get('/timeshelf', function (req, res) {
        // Tìm tất cả cách event của User
        //TODO: Chỉnh lại tìm event User được mời
        //TODO: Coi lại cách tìm user Fullname để hiển thị title

        if (!Array.isArray(idArray)) console.log('La array'); else console.log('Khong array');
        User.findOne({'_id': req.session.user.id}, function (err, user) {
            if (err) console.log('Error: ' + err);
            // Điều kiện tìm kiếm
            // + Event creator = bản thân
            // + Event có user.status = M hoặc A ( Member hoặc ẠTJ)
            // TODO: Làm sắp xếp Event đi
            var findEvent = {$or: [
                {'creator.userID': req.session.user.id},
                {
                    $and: [
                        {'user.userID': req.session.user.id},
                        {'user.status': {$in: ['m', 'a']}}
                    ]
                }
            ]}

            if (user) {
                EventDetail.find(findEvent, function (err, events) {
                    if (err) console.log(err);
                    res.render('event/timeShelf', {title: user.fullName, events: events, user: user});
                })
            }
        })

    });

}