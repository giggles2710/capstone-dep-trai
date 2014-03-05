/**
 * Created by Noir on 3/3/14.
 */

module.exports = function(io){
    // init
    var homepage = io.of('/homepage')
        .on('connection',function(socket){
            // user register to receive data to update homepage
            socket.on('join',function(data){
                socket.join('homepage:' + data.userId);
            });
        });
}