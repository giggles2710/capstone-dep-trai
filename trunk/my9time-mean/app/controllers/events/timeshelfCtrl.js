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
                EventDetail.find(findEvent).sort('-lastUpdated').limit(2).exec(function (err, events) {
                    if (err) console.log(err);
                    res.render('event/timeShelf', {title: user.fullName, events: events, user: user});
                })
            }
        })

    });

    // Code giống y của Nghĩa, có gì liên hệ nó @@
    // =================================================================================
    // POST: /:userID - View TimeShelf
    app.post('/timeshelf', function (req, res) {
        console.log("=============AJAX POST=============");
        var count = req.body.count;
        var currentUser = req.session.user;

        if (currentUser) {
            User.findOne({'_id': currentUser.id}, function (err, user) {
                    var findEvent = {$or: [
                        {'creator.userID': req.session.user.id},
                        {
                            $and: [
                                {'user.userID': req.session.user.id},
                                {'user.status': {$in: ['m', 'a']}}
                            ]
                        }
                    ]}


                    EventDetail.find(findEvent).sort('-lastUpdated').limit(2).skip(2 * count).exec(function (err, events) {
                        res.send(200, events);
                        console.log("events: " + events);
                    });
                }
            )
        }
    });

}