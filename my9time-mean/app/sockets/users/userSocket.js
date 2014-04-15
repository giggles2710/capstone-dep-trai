/**
 * Created by Noir on 3/5/14.
 */
'use strict'

var Notification = require('../../models/notification'),
    EventRequest = require('../../models/eventRequest'),
    User = require('../../models/user');

module.exports = function(io){
    var message = io.of('/user')
        .on('connection',function(socket){
            // TODO: notification
//            socket.on('friendAdded',function(data){
//                console.log('socket on event friendAdded');
//                var senderId = data.senderId;
//                // find the sender
//                User.findOne({'_id':senderId},function(err, user){
//                    if(err) return console.log(err);
//
//                    if(user){
//                        // create a notification
//                        var newNotification = new Notification();
//                        // init
//                        newNotification.owner = data.ownerId;
//                        newNotification.type = 'fr'; // TODO: need to confirm
//                        newNotification.content = {
//                            sender: {
//                                userId: senderId
//                            }
//                        };
//                        newNotification.content.sender.username = user.usernameByProvider;
//                        newNotification.content.sender.avatar = user.avatarByProvider;
//                        // saved it
//                        newNotification.save(function(res,notification){
//                            // announce to receiver update notification
//                            io.of('/homepage').in('homepage:'+data.ownerId).emit('updateFriendRequest');
//                        });
//                    }
//                });
//            });

            socket.on('friendAdded',function(data){
                io.of('/homepage').in('homepage:'+data.ownerId).emit('updateFriendRequest');
            });
            socket.on('friendConfirmed',function(data){
                console.log('im here: ' + data.ownerId);
                io.of('/homepage').in('homepage:'+data.ownerId).emit('updateNotification');
            })
            socket.on('eventRequestSent',function(data){
                if(data.eventId){
                    // find the host of this event
                    EventRequest.findOne({'event':data.eventId},function(err, eventRequest){
                        if(err) return console.log(err);

                        if(eventRequest){
                            io.of('/homepage').in('homepage:'+eventRequest.eventCreator).emit('updateEventRequest');
                        }else{
                            return console.log('** err: No such an event');
                        }
                    });
                }else{
                    // send to all user in list
                    for(var i=0;i<data.users.length;i++){
                        io.of('/homepage').in('homepage:'+data.users[i].userID).emit('updateEventRequest');
                    }
                }                
            });
        });

}


