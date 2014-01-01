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
    // GET: /addFriendTest
    app.get('/addFriendTest/:id', function(req, res){
        var userId = req.params.id;
        var status = 'isUnknown';
        User.findOne({'_id':userId},function(err, user){
            if(err) return console.log('Error: ' + err);

            if(user){
                // get current user
                if(req.session.user){
                    var curId = req.session.user.id;
                    // check friend status between current user and target user
                    for(var i=0;i<user.friend.length;i++){
                        var friend = user.friend[i];
                        // check
                        if(curId==friend.user){
                            if(friend.isConfirmed){
                                // is friend
                                status = 'isAdded';
                            }else{
                                // waiting for respond
                                status = 'isWaiting';
                            }
                            break;
                        }
                    } // end for
                }

                return res.render('users/addFriendTest', {'status':status,'userId':userId});
            }else{
                return console.log('This is no longer available.');
            }
        });
    });
    // ============================================================================
    // PUT: /addFriend by AJAX
    app.post('/addFriend/:id', function(req, res){
        var friendId = req.params.id;
        var userId = req.session.user.id;
        var curFriend;

        if(friendId && userId){
            User.findOne({'_id':friendId},function(err, friend){
                if(err) return res.send(500, 'Something wrong just happened. Please try again.');

                if(friend){
                    // if friend is exist
                    curFriend = friend;
                }else{
                    return res.send(500, 'This user is no longer available.');
                }
            });
            // then find user
            User.findOne({'_id':userId}, function(err, user){
                if(err) return res.send(500, 'Something wrong just happened. Please try again.');

                if(user){
                    console.log('im here user');
                    // send him a request
                    var friendRequest = new FriendRequest({
                        status: 'NEW'
                    });

                    friendRequest.user = user._id;
                    friendRequest.save(function(err){
                        if(err){
                            console.log(err);
                            return res.send(500, 'Something wrong just happened. Please try again.');
                        }
                    });
                    // update friend list
                    var newFriend = {};
                    var embeddedFriend = helper.getEmbeddedUser(curFriend);
                    newFriend.username = embeddedFriend.username;
                    newFriend.fullName = embeddedFriend.fullName;
                    newFriend.avatar = embeddedFriend.avatar;

                    user.friend.push(newFriend);
                    user.update(function(err, user){
                        if(err){
                            console.log(err);
                            return res.send(500, 'Something wrong just happened. Please try again.');
                        }

                        return res.send(200, 'Added successfully');
                    });
                    return res.send(200, 'Added successfully.');
                }else{
                    return res.send(500, 'This user is no longer available.');
                }
            });
        }else{
            return res.send(500, 'Unknown error.');
        }
    });

}


