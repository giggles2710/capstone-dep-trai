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

    app.get('/api/countUnreadFRequest', function(req, res, next){
        //if(!req.session.user) return next();
        // get all friend request for this user
        var userId = req.session.user.id;

        FriendRequest.count({'to':userId,'isRead':false}).exec(function(err, num){
            if(err){
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if(num=="") num = 0;
            return res.send(200, num);
        });
    });
    // ======================================================================================
    // GET: /ajaxGetFriendRequest
    app.get('/api/getFriendRequest',helper.checkAuthenticate, function(req, res, next){
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
    app.get('/api/init',function(req, res){
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
    // ======================================================================================
    // GET: DESTROY USERS DATABASE
    app.get('/api/destroy/user',function(req, res){
        User.remove({},function(err){
            if(err) return console.log(err);

            return res.redirect('/');
        });
    });
    // ============================================================================
    // GET: /userList
    app.get('/api/getUsers',function(req, res){
        var model = [];

        User.find(function(err, users){
            if(err) return console.log('Error: ' + err);

            if(users.length > 0){
                for(var i=0;i<users.length;i++){
                    var user = users[i];

                    var userModel = {
                        name: user.fullName,
                        id: user._id
                    }

                    model.push(userModel);
                }
                return res.send(200 , model);
            }
        });
    });

    app.get('/api/getFriendStatus/:id', function(req, res){
        var friendId = req.params.id;
        var userId = req.session.user.id;
        var status = 'unknown';

        if(friendId == userId){
            // This is my page
            // count number of friend request which is unread
            helper.countFriendRequest(friendId, false, function(err, count){
                if(err) return console.log('Error: ' + err);

                console.log('** friend status: ' + status);
                return res.send(200, false);
            });
        }else{
            FriendRequest.findOne({'from':friendId,'to':userId},function(err, friendRequest){
                if(err) return console.log('Error: ' + err);

                if(friendRequest){
                    status = 'need-confirm';

                    console.log('** friend status: ' + status);
                    return res.send(200, status);
                }else{
                    User.findOne({'_id':friendId},function(err, friend){
                        if(err) return console.log('Error: ' + err);

                        if(friend){
                            // get current user
                            if(userId){
                                User.findOne({'_id':userId},function(err, user){
                                    if(err) return console.log('Error: ' + err);
                                    // check friend status between current user and target user

                                    for(var i=0;i<user.friend.length;i++){
                                        var frTemp = user.friend[i];
                                        // check
                                        if(friendId==frTemp.userId){
                                            if(frTemp.isConfirmed){
                                                // is friend
                                                status = 'added';
                                            }else{
                                                // waiting for respond
                                                status = 'waiting';
                                            }
                                            break;
                                        }
                                    } // end for
                                    console.log('** friend status: ' + status);
                                    return res.send(200, status);
                                });
                            }
                        }else{
                            return console.log('This is no longer available.');
                        }
                    });
                }
            });
        }
    })

    // ============================================================================
    // GET: /addFriendTest

    app.get('/userList', function(req, res){
        res.sendfile('views/users/addFriendTest.html');
    });

    // ============================================================================
    // PUT: /unfriend by AJAX
    app.put('/api/unfriend', function(req, res){
        var friendId = req.body.id;
        var userId = req.session.user.id;

        console.log('friend: '+friendId+' user: '+userId);

        // delete user in friend list of friend
        FriendRequest.findOne({$or:[{'from':friendId,'to':userId},{'to':friendId,'from':userId}]},function(err, request){
            if(err){
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if(request){
                return res.send(200, 'unfriended');
            }else{
                // delete friend in friendList of user
                User.update({'_id':userId},{$pull:{friend:{'userId':friendId}}},function(err){
                    if(err){
                        console.log(err);
                        return res.send(500, 'Something wrong just happened. Please try again.');
                    }

                    return res.send(200, 'unfriended');
                });
            }
        });
    });

    // ============================================================================
    // put: /confirmFriendRequest by AJAX * NOTIFICATION
    app.put('/api/confirmFriendRequest', function(req, res){
        var senderId = req.body.id;
        var userId = req.session.user.id; // user that received request.

        // delete friend request
        FriendRequest.findOne({'to':userId,'from':senderId},function(err, friendRequest){
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
                                return res.send(200, 'confirmed');
                            });
                    }); // end update friend list
                }); // end remove friend request
            }
        });
    });
    
    // ============================================================================
    // PUT: /cancelRequest by AJAX
    app.put('/api/cancelRequest', function(req, res){
        var friendId = req.body.id;
        var userId = req.session.user.id;
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

                    // delete friend in user's user list
                    User.update({'_id':userId},{$pull:{friend:{'userId':friendId}}},function(err){
                        if(err){
                            console.log(err);
                            return res.send(500, 'Something wrong just happened. Please try again.');
                        }

                        return res.send(200, 'unfriended');
                    });
                });
            }else{
                return res.send(200, 'need-unfriend');
            }    
        });
    });

    // ============================================================================
    // PUT: check by AJAX * NOTIFICATION
    app.put('/api/addFriend', function(req, res){
        var friendId = req.body.id;
        var userId = req.session.user.id;
        // var friendRequestId = '';
        console.log('friend: ' + friendId);

        if(friendId && userId){
            // check if a request between friend and user is exist
            FriendRequest.findOne({'from':friendId,'to':userId},function(err, request){
                if(err){
                    console.log(err);
                    return res.send(500, 'Something wrong just happened. Please try again.');
                }

                if(request){
                    return res.send(200, 'need-confirm');
                }else{
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
                    return res.send(200, 'added');
                }
            });
        }else{
            return res.send(500, 'unknown-error.');
        }
    });

}


