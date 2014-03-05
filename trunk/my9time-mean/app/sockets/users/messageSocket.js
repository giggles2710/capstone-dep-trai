/**
 * Created by Noir on 3/4/14.
 */
'use strict'

module.exports = function(io){
    var message = io.of('/message')
        .on('connection',function(socket){
            socket.on('updateMessage',function(data){
                if(data.length > 0){
                    var receivers = data.receiverId.split(',');
                    for(var i=0;i<data.length;i++){
                        console.log('emit to ' + receivers[i]);
                        io.of('/homepage').in('homepage:'+receivers[i]).emit('updateMessage');
                    }
                }else{
                    console.log('emit to ' + data.receiverId);
                    io.of('/homepage').in('homepage:'+data.receiverId).emit('updateMessage');
                }
            });

            socket.on('joinChatroom',function(data){
                // check if this socket joined this room
                var roomList = io.sockets.manager.roomClients[socket.id];
                if(!roomList["/message/"+data.conversationId]){
                    // user haven't joined this room yet
                    socket.join(data.conversationId);
                    console.log(socket.id + ' joined chat room : ' + data.conversationId);
                }
            });

            socket.on('replied',function(data){
                // broadcast event to all client in this room
                socket.broadcast.to(data.conversationId).emit('updateChatroom', {message:data.message}); //emit to 'room' except this socket
            })
        });
}
