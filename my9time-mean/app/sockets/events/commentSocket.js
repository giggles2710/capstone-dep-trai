/**
 * Created by Noir on 3/3/14.
 */

module.exports = function(io){
    // init
    var comment = io.of('/comment')
        .on('connection',function(socket){
            // user register to receive data to update homepage
            socket.on('join',function(data){
                socket.join('Comment:' + data.userId);
            });
        });
}