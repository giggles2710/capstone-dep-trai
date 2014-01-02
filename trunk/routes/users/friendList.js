/**
 * Created by Noir on 1/1/14.
 */

var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , User = require(path.join(HOME + "/models/user"))
    , FriendRequest = require(path.join(HOME + "/models/friendRequest"))
    , helper = require(path.join(HOME + "/helpers/helper"));

module.exports = function(app){
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

                    if(!(user._id == req.session.user.id)){
                        var userModel = {
                            name: user.fullName,
                            id: user._id
                        }

                        models.users.push(userModel);
                    }
                }

                console.log(models);
                return res.render('users/userList',models);
            }
        });

        return console.log('Something happened.');
    });

    // ============================================================================
    // GET: /addFriendTest
    app.get('/addFriendTest/:id', function(req, res){
        var friendId = req.params.id;
        var status = 'isUnknown';
        User.findOne({'_id':friendId},function(err, friend){
            if(err) return console.log('Error: ' + err);

            if(friend){
                // get current user
                if(req.session.user){
                    var userId = req.session.user.id;
                    User.findOne({'_id':userId},function(err, user){
                        if(err) return console.log('Error: ' + err);
                        // check friend status between current user and target user
                        for(var i=0;i<user.friend.length;i++){
                            var frTemp = user.friend[i];
                            // check
                            if(friendId==frTemp.user){
                                if(frTemp.isConfirmed){
                                    // is friend
                                    status = 'isAdded';                                
                                }else{
                                    // waiting for respond
                                    status = 'isWaiting';
                                }
                                break;
                            }
                        } // end for
                        return res.render('users/addFriendTest', {'status':status,'userId':friendId, 'ownerId':friendId, onlinerId: req.session.user.id});
                    });                    
                }                
            }else{
                return console.log('This is no longer available.');
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
                // delete friend request in friend
                User.update({'_id':friendId},{$pull:{friendRequest:friendRequest._id}},function(err, friendRequest){
                    if(err){
                        console.log(err);
                        return res.send(500, 'Something wrong just happened. Please try again.');
                    }                
                });
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
    // PUT: /addFriend by AJAX
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
                // friendRequestId = friendRequest._id;
                User.update({'_id':friendId},{$push:{friendRequest:friendRequest._id}},{upsert:true},function(err, user){
                    if(err){
                        console.log(err);
                        return res.send(500, 'Something wrong just happened. Please try again.');
                    }
                });
            });
            // update friend list
            User.update({'_id':userId},{$push:{friend:{user:friendId}}}, {upsert:true}, function(err, user){
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


