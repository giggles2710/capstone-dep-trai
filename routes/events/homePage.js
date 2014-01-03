/**
 * Created by Nova on 1/2/14.
 */
var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , eventDetail = require(path.join(HOME + "/models/eventDetail"))
    , helper = require(path.join(HOME + "/helpers/event.Helper"))
    , User = require(path.join(HOME + "/models/user"));


module.exports = function(app) {

//==============================================================================================
// get all event relate to current User
    app.get('/myniti', function (req, res) {
        if (req.session.user) {
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                // Get User's friend list from Database
                if (err) return console.log(err);
                else {
                    // get all friends
                    var friendList = new Array();
                    for (var i=0;i< user.friend.length;i++){
                        var tmp = user.friend[i];
                        if (tmp.isConfirmed){
                            friendList[i]= tmp.user;
                        }
                    }
                 //get event of all friends which status is public or group
                    for(var i; i < friendList.length; i++){
                        eventDetail.findOne({'userId': friendList[i]}, function (err, event) {
                            if (err) return console.log(err);

                            if (event) {

                            }
                        });
                    }

                }
            });
        } else {
            return res.redirect('/login');
        }


    });


}