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
        var currentUser = req.session.user;
        if (currentUser) {
            User.findOne({'_id': currentUser.id}, function (err, user) {
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

                    friendList.push(currentUser.id);
                //get events of all friends
                    for (var i = 0; i < friendList.length; i++){
                        //  lấy ra cái event mà : event đó ở chế độ close community hoặc open.Và bạn mình là người tham gia ở dạng member hoặc ask to join,
                        //  hoặc bạn mình là người tạo.
                        eventDetail.find({ $and:[
                                                {'privacy': {$in:['c','o']}},
                                                {$or :[
                                                      {$and:[
                                                          {'user.userId':friendList[i]},
                                                          {'user.status': {$in:['m','a']}}]},
                                                      {'creator.userId': friendList[i]}]}
                                        ]},{sort:[['lastUpdated']]},//.sort({'lastUpdated': -1}).limit(2),//TODO : đang test

                        function(err,event){
                            if(err) return console.log("Không tìm được");
                            else {
                                console.log(event);
                                res.render('event/home', {events: event});

                            }

                        })
                    }


                }
            });
        } else {
            return res.redirect('/login');
        }


    });

//==========================================================================================
// For Post AJAX
    app.post('/myniti', function (req, res) {
        var count = req.body.count;
        var currentUser = req.session.user;
        if (currentUser) {
            User.findOne({'_id': currentUser.id}, function (err, user) {
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

                    friendList.push(currentUser.id);
                    //get events of all friends
                    for (var i = 0; i < friendList.length; i++){
                        //  lấy ra cái event mà : event đó ở chế độ close community hoặc open.Và bạn mình là người tham gia ở dạng member hoặc ask to join,
                        //  hoặc bạn mình là người tạo.
                        eventDetail.find({ $and:[
                            {'privacy': {$in:['c','o']}},
                            {$or :[
                                {$and:[
                                    {'user.userId':friendList[i]},
                                    {'user.status': {$in:['m','a']}}]},
                                {'creator.userId': friendList[i]}]}
                        ]},{sort:[['lastUpdated']]},//.sort({'lastUpdated': -1}).limit(2*count),//TODO : đang test nữa nè

                            function(err,event){
                                if(err) return console.log("Không tìm được");
                                else {
                                    console.log(event);
                                    res.render('event/home', {events: event});

                                }

                            })
                    }


                }
            });
        } else {
            return res.redirect('/login');
        }


    });


}