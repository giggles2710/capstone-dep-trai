/**
 * Created by Nova on 3/8/14.
 */

module.exports = function(io){
    // init
    var event = io.of('/event')
        .on('connection',function(socket){
            // user register to receive data to update homepage
            socket.on('join',function(data){
                socket.join('event:' + data.eventId);
            });
        });
}