/**
 * Created by Noir on 3/24/14.
 */
'use strict'
var Notification = require('../../models/notification'),
    User = require('../../models/user');

module.exports = function(io){
    var event = io.of('/event')
        .on('connection',function(socket){
            // user register to update any updates from event
            socket.on('join',function(data){
                socket.userId = data.userId;
                if(data.ids){
                    // multiple join
                    var rooms = io.sockets.manager.roomClients[socket.id];
                    for(var i=0;i<data.ids.length;i++){
                        // check if this socket is join this room
                        if(!rooms["/event/event:"+data.ids[i]]){
                            // if he haven't joined yet, so join now
                            socket.join('event:'+data.ids[i]);
                        }
                    }
                }else{
                    socket.join('event:'+data.id);
                }
            });
            // when new comment comes and user is not on event detail page, send a notification
            socket.on('newComment',function(data){
                console.log('clients: ' + io.sockets.clients('event:'+data.postId));
//                socket.broadcast.to('event:'+data.postId).emit('updateComment', {'postId':data.postId,'comment':data.comment});
                io.of('/event').in('event:'+data.postId).emit('updateComment', {'postId':data.postId,'comment':data.comment});
            })

            // when new like
            socket.on('newLike',function(data){
                console.log('clients: ' + io.sockets.clients('event:'+data.postId));
                io.of('/event').in('event:'+data.postId).emit('updateLike', {'postId':data.postId});
            })

            // when update Event Intro
            socket.on('newEventIntro',function(data){
                console.log('clients: ' + io.sockets.clients('event:'+data.postId));
                io.of('/event').in('event:'+data.postId).emit('updateEventIntro', {'postId':data.postId});
            })

            // when update Event Announcement
            socket.on('newAnnouncement',function(data){
                console.log('clients: ' + io.sockets.clients('event:'+data.postId));
                io.of('/event').in('event:'+data.postId).emit('updateAnnouncement', {'postId':data.postId});
            })

            // when update Event Announcement
            socket.on('newLike',function(data){
                console.log('clients: ' + io.sockets.clients('event:'+data.postId));
                io.of('/event').in('event:'+data.postId).emit('updateLike', {'postId':data.postId});
            })

        });
}


