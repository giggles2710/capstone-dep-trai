/**
 * Created by Noir on 2/17/14.
 */

var FriendRequest = require('../../models/friendRequest'),
    User = require('../../models/user');

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
    var userId = req.session.user.id;

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
    var userId = req.session.user.id;
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
}

