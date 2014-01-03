/**
 * Created by Noir on 1/1/14.
 */

var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , User = require(path.join(HOME + "/models/user"))
    , FriendRequest = require(path.join(HOME + "/models/friendRequest"))
    , helper = require(path.join(HOME + "/helpers/helper"))
    , fsx = require('fs-extra');

module.exports = function(app){
    // ======================================================================================
    // GET: /ajaxGetFriendRequest
    app.get('/ajaxGetFriendRequest',function(req, res, next){
        if(!req.xhr) return next();
        if(!req.session.user) return next();

        // get all friend request for this user
        var userId = req.session.user.id;
        var requestList = [];

        FriendRequest.find({'to':userId}).exec(function(err, requests){
            if(err){
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if(requests.length>0){
                // parse object id
                for(var i=0;i<requests.length;i++){
                    var requestRaw = requests[i];
                    var request = {
                        requestId: requestRaw._id,
                        fromId: requestRaw.from,
                        fromName: '',
                        avatar: '',
                        isRead: requestRaw.isRead
                    }
                    User.findOne({'_id':requestRaw.from})
                        .exec(function(err, user){
                            if(err) {
                                console.log(err);
                                return res.send(500, 'Something wrong just happened. Please try again.');
                            }

                            if(user){
                                var provider = user.provider;
                                switch (provider){
                                    case 'facebook':
                                        request.avatar = user.facebook.avatar;
                                        break;
                                    case 'google':
                                        request.avatar = user.google.avatar;
                                        break;
                                    case 'local':
                                        request.avatar = user.avatar;
                                        break;
                                }
                                request.fromName = user.fullName;
                                requestList.push(request);

                                if(requestList.length==requests.length){
                                    // update all request to READ
                                    FriendRequest.update({},{'isRead':true},{multi:true}, function(err){
                                        if(err) return next();
                                    });
                                    return res.send(200, requestList);
                                }
                            }
                        });
                } // end initialize request list
            }else{
                return res.send(200,'none');
            }
        });
    });
    // ======================================================================================
    // GET: INIT DATABASE
    app.get('/api/init', function(req, res){
        fsx.readFile(path.join(HOME + '/db.json'),'utf-8',function(err, rawMenu){
            if(err)
                console.log("** Read file error: " + err);
            else{
                var data = JSON.parse(rawMenu);
                for(var i=0;i<data.length;i++){
                    // user.birthday = new Date(req.body.year, req.body.month, req.body.date);
                    var birthday = new Date(data[i].year, data[i].month, data[i].date);
                    new User({
                        firstName: data[i].firstName,
                        lastName: data[i].lastName,
                        birthday: birthday,
                        'local.username': data[i].username,
                        'local.password': data[i].password,
                        gender: data[i].gender,
                        provider: data[i].provider,
                        email:data[i].email
                    }).save(function(err){
                            if(err){
                                console.log("** " + err);
                                res.send('ERR');
                            }
                        });
                }
                console.log('Init done...');
                User.find(function(err, users){
                    if(!err)
                        res.send(users);
                });
            }
        });
    });
    // ============================================================================
    // GET: /userList
    app.get('/userList',function(req, res){
        var models = {
            title: 'User List',
            users: []
        };

        User.find(function(err, users){
            if(err) return console.log('Error: ' + err);

            if(users.length > 0){
                for(var i=0;i<users.length;i++){
                    var user = users[i];

                    var userModel = {
                        name: user.fullName,
                        id: user._id
                    }

                    models.users.push(userModel);
                }
                return res.render('users/userList',models);
            }
        });
    });

    // ============================================================================
    // GET: /addFriendTest
    app.get('/addFriendTest/:id', function(req, res){
        var friendId = req.params.id;
        var userId = req.session.user.id;
        var status = 'isUnknown';
        var models = {
            status: status,
            userId: friendId,
            ownerId: friendId,
            onlinerId: userId,
            count: 0
        }

        if(friendId == userId){
            // This is my page
            // count number of friend request which is unread
            FriendRequest.count({'to':friendId,'isRead':false},function(err, count){
                if(err) return console.log('Error: ' + err);

                models.count = count;
                return res.render('users/addFriendTest', models);
            });
        }else{
            User.findOne({'_id':friendId},function(err, friend){
                if(err) return console.log('Error: ' + err);

                if(friend){
                    // get current user
                    if(userId){
                        User.findOne({'_id':userId},function(err, user){
                            if(err) return console.log('Error: ' + err);
                            // check friend status between current user and target user

                            console.log(user.friend.length);
                            for(var i=0;i<user.friend.length;i++){
                                var frTemp = user.friend[i];
                                // check
                                console.log(friendId + ' vs ' + user.friend[i].userId);
                                if(friendId==frTemp.userId){
                                    if(frTemp.isConfirmed){
                                        // is friend
                                        models.status = 'isAdded';
                                    }else{
                                        // waiting for respond
                                        models.status = 'isWaiting';
                                    }
                                    break;
                                }
                            } // end for
                            console.log(status);
                            return res.render('users/addFriendTest', models);
                        });
                    }
                }else{
                    return console.log('This is no longer available.');
                }
            });
        }


    });

    // ============================================================================
    // PUT: /unfriend by AJAX
    app.put('/unfriend/:id', function(req, res){
        var friendId = req.params.id;
        var userId = req.session.user.id;

        // delete user in friendlist of friend
        User.update({'_id':friendId},{$pull:{friend:{'userId':userId}}},function(err){
            if(err){
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            // delete friend in friendList of user
            User.update({'_id':userId},{$pull:{friend:{'userId':friendId}}},function(err){
                if(err){
                    console.log(err);
                    return res.send(500, 'Something wrong just happened. Please try again.');
                }

                return res.send(200, 'Unfriended.');
            });
        });
    });

    // ============================================================================
    // put: /confirmFriendRequest by AJAX * NOTIFICATION
    app.put('/confirmFriendRequest/:id/:sender', function(req, res){
        var friendRequestId = req.params.id;
        var senderId = req.params.sender;
        var userId = req.session.user.id; // user that received request.

        // delete friend request
        FriendRequest.findOne({'_id':friendRequestId},function(err, friendRequest){
            if(err){
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if(friendRequest){
                // delete friend request
                friendRequest.remove(function(err){
                    if(err){
                        console.log(err);
                        return res.send(500, 'Something wrong just happened. Please try again.');
                    }

                    // add user in friend list of friend
                    User.update({'_id':userId},{$push:{friend:{'userId':senderId,'isConfirmed':true}}},function(err){
                        if(err){
                            console.log(err);
                            return res.send(500, 'Something wrong just happened. Please try again.');
                        }
                        // change isConfirmed in friendList of user
                        User.update(
                            {'friend.userId':userId},
                            {'$set':{
                                'friend.$.isConfirmed':true
                            }}, function(err){
                                if(err){
                                    console.log(err);
                                    return res.send(500, 'Something wrong just happened. Please try again.');
                                }

                                console.log('come here is ok');
                                return res.send(200, 'confirmed');
                            });
                    }); // end update friend list
                }); // end remove friend request
            }
        });
    });
    
    // ============================================================================
    // PUT: /cancelRequest by AJAX
    app.put('/cancelRequest/:id',function(req, res){
        var friendId = req.params.id;
        var userId = req.session.user.id;

        // delete friend in user's friend list
        User.update({'_id':userId},{$pull:{friend:{'user':friendId}}},function(err){
            if(err){
                    console.log(err);
                    return res.send(500, 'Something wrong just happened. Please try again.');
            }
        });      
        // friend request in friend request  
        // delete friend request in friend request
        FriendRequest.findOne({'from':userId,'to':friendId},function(err, friendRequest){
            if(err){
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if(friendRequest){
                // delete friend request
                friendRequest.remove(function(err, friendRequest){
                    if(err){
                        console.log(err);
                        return res.send(500, 'Something wrong just happened. Please try again.');
                    }  
                });

                return res.send(200, 'Unfriend');
            }else{
                return res.send(500, 'Cancel request fail.');
            }    
        });
    });

    // ============================================================================
    // PUT: /addFriend by AJAX * NOTIFICATION
    app.put('/addFriend/:id', function(req, res){
        var friendId = req.params.id;
        var userId = req.session.user.id;
        // var friendRequestId = '';

        if(friendId && userId){
            // send him a request
            var friendRequest = new FriendRequest();

            friendRequest.from = userId;
            friendRequest.to = friendId;
            friendRequest.save(function(err, friendRequest){
                if(err){
                    console.log(err);
                    return res.send(500, 'Something wrong just happened. Please try again.');
                }
                // update friend request list on user
            });
            // update friend list
            User.update({'_id':userId},{$push:{friend:{userId:friendId}}}, {upsert:true}, function(err, user){
                if(err){
                    console.log(err);
                    return res.send(500, 'Something wrong just happened. Please try again.');
                }
            });

            return res.send(200, 'Add success.');
        }else{
            return res.send(500, 'Unknown error.');
        }
    });

}


