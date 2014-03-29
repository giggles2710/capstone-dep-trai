/**
 * Created by Noir on 2/17/14.
 */

var FriendRequest = require('../../models/friendRequest'),
    User = require('../../models/user'),
    EventDetail = require('../../models/eventDetail'),
    EventRequest = require('../../models/eventRequest'),
    Notification = require('../../models/notification'),
    Conversation = require('../../models/conversation'),
    ObjectId = require('mongoose').Types.ObjectId,
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
    var friendRequestQuery;
    if(req.body.requestId){
        // confirm from notification
        friendRequestQuery = {'_id':req.body.requestId};
    }else{
        friendRequestQuery = {'to':req.session.passport.user.id,'from':req.body.id};
    }
    // delete friend request
    FriendRequest.findOne(friendRequestQuery,function(err, friendRequest){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        if(friendRequest){
            // delete friend request
            friendRequest.remove(function(err){
                if(err){
                    console.log(err);
                    return res.send(500, {error: err});
                }

                console.log('im here');
                // add user in friend list of friend
                User.update({'_id':friendRequest.to},{$push:{friend:{'userId':friendRequest.from,'isConfirmed':true}}},function(err){
                    if(err){
                        console.log(err);
                        return res.send(500, {error: err});
                    }
                    // change isConfirmed in friendList of user
                    User.update(
                        {'friend.userId':friendRequest.to},
                        {'$set':{
                            'friend.$.addedDate': new Date(),
                            'friend.$.isConfirmed':true
                        }}, function(err){
                            if(err){
                                console.log(err);
                                return res.send(500, {error: err});
                            }
                            return res.send(200, 'confirmed');
                        });
                }); // end update friend list
            }); // end remove friend request
        }else{
            return res.send(200, 'confirmed');
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
    var stringSearch = req.query.q;

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
                    Helper.changeUserToEmbeddedArray(user.friend,null,stringSearch,function(err,embFriends){
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
                        Helper.changeUserToEmbeddedArray(user.friend,null,stringSearch,function(err,embFriends){
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
                                return res.send(200, status);
                            });
                        }
                    }else{
                        return res.send(400, 'This user is no longer available.')
                    }
                });
            }
        });
    }
}

/**
 * thuannh
 * get all friends
 *
 * @param req
 * @param res
 * @param next
 */
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
    });
}

/**
 * thuannh
 * get all notifications for user
 *
 * @param req
 * @param res
 * @param next
 */
exports.getAllNotifications = function(req, res, next){
    if(req.session.passport.user){
        var userId = req.session.passport.user.id;

        Notification.find({'owner':userId},function(err, notifications){
            if(err){
                console.log(err);
                return res.send(500, {error: err});
            }

            if(notifications.length>0){
                // change to client format
                changeNotificationToClient(notifications,null,function(err,clientNotis){
                    if(err){
                        console.log(err);
                        return res.send(500, {error:err});
                    }
                    return res.send(200, clientNotis);
                });
            }else{
                return res.send(200, []);
            }
        });
    }
}

/**
 * thuannh
 * get all friend requests for user
 *
 * @param req
 * @param res
 * @param next
 */
exports.getAllFriendRequest = function(req, res, next){
    var userId = req.query.userId;

    FriendRequest.find({'$or':[{'from':userId},{'to':userId}]}, function(err, requests){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        if(requests.length>0){
            return res.send(200, requests);
        }

        return res.send(200, []);
    });
}

/**
 * thuannh
 * get all event requets for user
 *
 * @param req
 * @param res
 * @param next
 */
exports.getAllEventRequest = function(req, res, next){
    var userId = req.query.userId;
    EventRequest.find({'user':userId}, function(err, requests){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        if(requests.length>0){
            return res.send(200, requests);
        }

        return res.send(200, []);


    });
}

exports.countUnreadNotification = function(req, res, next){
    var userId = req.params.userId;
    Notification.find({'owner':userId,'isRead':false},function(err, count){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }
        return res.send(200, {'count':count.length});
    });
}

/**
 * thuannh
 * count unread friend request of user
 *
 * @param req
 * @param res
 * @param next
 */
exports.countUnreadFriendRequest = function(req, res, next){
    var userId = req.params.userId;

    FriendRequest.find({'to':userId,'isRead':false},function(err, count){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        return res.send(200, {'count':count.length});
    });
}

/**
 * thuannh
 * count all unread event requets of user
 *
 * @param req
 * @param res
 * @param next
 */
exports.countUnreadEventRequest = function(req, res, next){
    var userId = req.params.userId;
    EventRequest.find({'$or':[{'eventCreator':new ObjectId(userId)},{'user':new ObjectId(userId)}],'isRead':false},function(err, count){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        return res.send(200, {'count':count.length});
    });
}

/**
 * thuannh
 * count unread messages
 *
 * @param req
 * @param res
 * @param next
 */
exports.countMessageUnread = function(req, res, next){
    var userId = req.params.userId;
    Conversation.find({'participant.userId': new ObjectId(userId),'participant.isRead':false},function(err, conversation){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        return res.send(200, {'count':conversation.length});
    });
}

/**
 * thuannh
 * get recently chat logs
 *
 * @param req
 * @param res
 * @param next
 */
exports.getRecentChatters = function(req, res, next){
    var userId = req.params.userId;
    Conversation.find({'participant.userId':new ObjectId(userId)}).sort({'lastUpdatedDate':-1}).exec(function(err, conversation){
       if(err){
           console.log(err);
           return res.send(500, {error: err});
       }

        var rs = [];
       if(conversation.length > 0){
           var rs = [];
           for(var i=0;i<conversation.length;i++){
               rs.push({'conversationId':conversation[i]._id,participant: conversation[i].participant});
           }
       }
        return res.send(200, rs); // only participants
    });
}

/**
 * thuannh
 * get friend request of user in client format
 *
 * @param req
 * @param res
 * @param next
 */
exports.getFriendRequestForNotification = function(req, res, next){
    var userId = req.params.userId;
    FriendRequest.find({'to':userId},function(err, requests){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        if(requests.length == 0){
            return res.send(200, []);
        }else{
            // convert server database into client format
            // client format consist of username, image, friendRequest id
            // parse 'to' array from ObjectId to user's information
            parseFriendRequestToClient(requests,null,function(err, requests){
                if(err){
                    console.log(err);
                    return res.send(500, {error: err});
                }
                return res.send(200, requests);
            });
        };
    });
}

/**
 * thuannh
 * get event request of user in client format
 *
 * @param req
 * @param res
 * @param next
 */
exports.getEventRequestForNotification = function(req, res, next){
    var userId = req.params.userId;
    EventRequest.find({'$or':[{'eventCreator':userId},{'user':userId}]},function(err, requests){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        if(requests.length == 0){
            return res.send(200, []);
        }else{
            // convert server database into client format
            // client format consist of username, image, friendRequest id
            // parse 'to' array from ObjectId to user's information
            parseEventRequestToClient(requests,null,function(err, requests){
                if(err){
                    console.log(err);
                    return res.send(500, {error: err});
                }
                return res.send(200, requests);
            });
        };
    });
}

// =====================================================================================================================
// PRIVATE METHODS

/**
 * thuannh
 * parse an user in friend request to client format
 *
 * @param input
 * @param output
 * @param cb
 * @returns {*}
 */
function parseFriendRequestToClient(input,output,cb){
    if(input.length == 0){
        return cb(null,output);
    }

    if(!output){
        output = [];
    }

    var frUser = input[0];

    User.findOne({'_id':frUser.from},function(err, user){
        if(err) return cb(err,null);

        if(user){
            var tempUser = {};
            tempUser.id = frUser._id;
            tempUser.userId = user._id;
            tempUser.image = user.avatarByProvider;
            tempUser.username = user.usernameByProvider;

            output.push(tempUser);
            // delete input
            input.splice(0,1);
            // call recursive
            parseFriendRequestToClient(input,output,cb);
        }else{
            // delete input
            input.splice(0,1);
            // call recursive
            parseFriendRequestToClient(input,output,cb);
        }
    })

}

/**
 * thuannh
 * parse an user in event request to client format
 *
 * @param input
 * @param output
 * @param cb
 * @returns {*}
 */
function parseEventRequestToClient(input,output,cb){
    if(input.length == 0){
        return cb(null,output);
    }

    if(!output){
        output = [];
    }

    var request = input[0];

    User.findOne({'_id':request.user},function(err, user){
        if(err) return cb(err,null);

        if(user){
            var tempUser = {};
            tempUser.isInvitation = true;
            if(request.eventCreator){
                tempUser.isInvitation = false;
            }
            tempUser.userId = user._id;
            tempUser.image = user.avatarByProvider;
            tempUser.username = user.usernameByProvider;

            // get event name
            EventDetail.findOne({'_id':request.event},function(err, event){
                if(err) return cb(err, null);

                if(event){
                    tempUser.eventId = event._id;
                    tempUser.eventName = event.name;
                    output.push(tempUser);
                    // delete input
                    input.splice(0,1);
                    // call recursive
                    parseEventRequestToClient(input,output,cb);
                }else{
                    // delete input
                    input.splice(0,1);
                    // call recursive
                    parseEventRequestToClient(input,output,cb);
                }
            });
        }else{
            // delete input
            input.splice(0,1);
            // call recursive
            parseEventRequestToClient(input,output,cb);
        }
    })

}

/**
 * thuannh
 * reject friend request
 *
 * @param req
 * @param res
 * @param next
 */
exports.rejectFriendRequest = function(req, res, next){
    // delete friend request
    FriendRequest.findOne({'_id':req.body.requestId},function(err, friendRequest){
        if(err){
            console.log(err);
            return res.send(500, {error: err});
        }

        if(friendRequest){
            // delete friend request
            friendRequest.remove(function(err){
                if(err){
                    console.log(err);
                    return res.send(500, {error: err});
                }

                // add user in friend list of friend
                User.update({'_id':friendRequest.from},{$pull:{friend:{'userId':friendRequest.to}}},function(err){
                    if(err){
                        console.log(err);
                        return res.send(500, {error: err});
                    }

                    return res.send(200, 'rejected');
                }); // end update friend list
            }); // end remove friend request
        }
    });
}

function changeNotificationToClient(notifications,output,cb){
    if(notifications.length==0){
        return cb(null,output);
    }
    if(!output){
        output = [];
    }
    var notification = notifications[0];
    var outputNotification = notification;
    var senders = [];
    for(var i=0;i<notification.content.sender.length;i++){
        senders.push(notification.content.sender[i].userId);
    }
    // find senders
    User.find({'_id':{'$in':senders}},function(err,users){
        if(err) return cb(err,null);

        outputNotification.content.senderUsername = [];
        for(var i=0;i<users.length;i++){
            outputNotification.content.senderUsername.push(users[i].usernameByProvider);
            if(senders[senders.length-1]==users[i]._id){
                outputNotification.content.image = users[i].avatarByProvider;
            }
        }
        // find event name
        EventDetail.findOne({'_id':notification.content.event},function(err,event){
            if(err) return cb(err,null);

            outputNotification.content.eventName = event.name;
            // splice it
            notifications.splice(0,1);
            // push to output
            output.push(outputNotification);
            // move to next item
            changeNotificationToClient(notifications,output,cb);
        });
    });

}