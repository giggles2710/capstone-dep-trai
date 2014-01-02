var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , FriendRequest = require(path.join(HOME + '/models/friendRequest'));

module.exports = function(app){
	app.io.route('addFriend',{
		addFriend: function(req){
            // id of friend
            var owner = req.data;
            var unReadRequest = 0;
            FriendRequest.count({'to':owner,'isRead':false}, function(err, count){
                if(err){
                    console.log(err);

                    return;
                }

                unReadRequest = count;
            });
            console.log(unReadRequest);
            // emit a notification
			req.io.room(owner).broadcast('updateFriendRequest',{count: unReadRequest,toId:owner});
		}
	});
}