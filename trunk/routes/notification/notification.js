/**
 * Created by Noir on 12/31/13.
 */

module.exports = function(app, sio){
    var notification = sio.of('/notification').on('connection',function(socket){

        // clients need to send a "user" message to identify themselves...
        socket.once("user",function(err, userData){
            // make sure we have the data we need
            if(userData == null || (userData.Id || null) == null){
                return;
            }

            // join the user to their own private channel to send them notification
            socket.join(userData.Id);
        });

        // we can now "push infor to the user from any process that can connect
        socket.on("push",function(data){

            console.log(data);
            // make sure we have the data we need...
            if(data == null || (data.Id || null)==null){
                return;
            }

            // let's clean up the data a little (we dont need to tell the user who they are)
            var channel = data.Id;
            delete data.Id;
            console.log(data);
            // now we will broadcast the data only to the user's private channel.
            socket.broadcast.to(channel, data).emit("update", data);
        });
    });

    // ROUTES
    app.get('/notificationAll', function(req, res){
        var model = {
            userId      :   "",
            title       :   "View Notification",
            isLoggedIn  :   false
        }
        if(req.session.user){
            model.userId = req.session.user.id;
            model.isLoggedIn = true;
        }
        return res.render('notification/all',model);
    });
}