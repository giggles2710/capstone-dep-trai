/**
 * Created by Noir on 2/17/14.
 */

var FriendRequest = require('../../models/friendRequest'),
    User = require('../../models/user'),
    EventDetail = require('../../models/eventDetail'),
    Helper = require('../../../helper/helper');

/**
 * thuannh
 * add friend
 * 1. check if a request between friend and current user is exist. If true, announce 'need-confirm' else create new request
 * 2. update friendList of both the current user and his friend.
 *
 * @param req
 * @param res
 * @param next
 * @returns {*|Transport|EventEmitter|boolean|Request|ServerResponse}
 */
exports.addFriend = function(req, res, next){
    var friendId = req.body.id;
    var userId = req.session.passport.user.id;

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
}

/**
 * thuannh
 * unfriend
 *
 * 1. find the friend request of the current user and his friend
 * 2. if false, pull the friend out of the current user's friend list
 *
 * @param req
 * @param res
 * @param next
 */
exports.unfriend = function(req, res, next){
    var friendId = req.body.id;
    var userId = req.session.passport.user.id;
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
}

/**
 * thuannh
 * cancel friend request
 *
 * 1. find the friend request between the current user and his friend.
 * 2. if true, delete this friend request.
 * 3. pull the friend out of the current user's friend list.
 *
 * @param req
 * @param res
 * @param next
 */
exports.cancelRequest = function(req, res, next){
    var friendId = req.body.id;
    var userId = req.session.passport.user.id;
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
}

/**
 * thuannh
 * confirm friend request
 *
 * 1. find the friend request
 * 2. if true, delete this friend request
 * 3. add the friend into the current user's friend list
 * 4. add the current user into the friend's friend list
 *
 * @param req
 * @param res
 * @param next
 */
exports.confirmRequest = function(req, res, next){
    var senderId = req.body.id;
    var userId = req.session.passport.user.id; // user that received request.

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
}

/**
 * thuannh
 * get all friends of this user
 *
 * @param req
 * @param res
 * @param next
 */
exports.getAllFriendToInvite = function(req,res,next){
    var userId = req.params.userId;
    var eventId = req.params.eventId;

    if(eventId.indexOf('off') > -1){
        // get all friend token
        User.findOne({'_id':userId},function(err, user){
            if(err){
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            if(user){
                // found
                if(user.friend.length>0){
                    Helper.changeUserToEmbeddedArray(user.friend,null,function(err,embFriends){
                        if(err){
                            console.log(err);
                            return res.send(500, 'Something wrong just happened. Please try again.');
                        }
                        // send embedded array to client
                        return res.send(200, embFriends);
                    });
                }else{
                    return res.send(200, []);
                }
            }else{
                // not found
                return res.send(500, 'This user is no longer available.');
            }
        })
    }else{
        // get all friend token for event
        EventDetail.findOne({'_id':eventId},function(err, event){
            if(err){
                console.log(err);
                return res.send(500, 'Something wrong just happened. Please try again.');
            }

            var friendList = event.user;
            User.findOne({'_id':userId},function(err, user){
                if(err){
                    console.log(err);
                    return res.send(500, 'Something wrong just happened. Please try again.');
                }

                if(user){
                    // found
                    if(user.friend.length>0){
                        Helper.changeUserToEmbeddedArray(user.friend,null,function(err,embFriends){
                            if(err){
                                console.log(err);
                                return res.send(500, 'Something wrong just happened. Please try again.');
                            }

                            // erase the user that is invited
                            if(friendList.length>0){
                                for(var i=0;i<embFriends.length;i++){
                                    var indexFound = -1;
                                    for(var j=0;j<friendList.length;j++){
                                        var friendId = embFriends[i].id;
                                        var invitedId = friendList[j].userID;

                                        if(friendId.toString() === invitedId.toString()){
                                            indexFound = i;
                                        }
                                    }
                                    // friend is invited, don't show him
                                    if(indexFound > -1) embFriends.splice(indexFound, 1);
                                }
                            }
                            // send embedded array to client
                            return res.send(200, embFriends);
                        });
                    }else{
                        return res.send(200, []);
                    }
                }else{
                    // not found
                    return res.send(500, 'This user is no longer available.');
                }
            });
        });
    };
}

/**
 * thuannh
 * check friend status
 *
 * @param req
 * @param res
 * @param next
 */
exports.checkFriendStatus = function(req, res, next){
    var friendId = req.params.friendId;
    var userId = req.session.passport.user.id;
    var status = 'unknown';

    if(friendId == userId){
        // This is my page
        // count number of friend request which is unread
        Helper.countFriendRequest(friendId, false, function(err, count){
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
                        console.log('This is no longer available.');
                        return res.send(400, 'This user is no longer available.')
                    }
                });
            }
        });
    }
}


exports.getAllFriend = function(req, res, next){
    var userId = req.params.userId;
    // get this user
    User.findOne({'_id':userId},function(err, user){
        if(err){
            return res.send(500, 'Something wrong happended: ' + err);
        }

        if(user){
            // get friend list who confirmed
            var confirmedFriend = [];
            for(var i=0;i<user.friend.length;i++){
                var tmp = user.friend[i];
                if(tmp.isConfirmed){
                    confirmedFriend.push(tmp);
                }
            }
            // get latest friend information
            Helper.getUserInfoForArray(confirmedFriend,null,function(err, friends){
                if(err){
                    return res.send(500, err);
                }

                return res.send(200, friends);
            })
        }else{
            return res.send(500, 'User is no longer available.');
        }
    })
}
