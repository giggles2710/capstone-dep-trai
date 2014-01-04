var path = require('path')
    , HOME = path.normalize(__dirname + '/../..')
    , helper = require(path.join(HOME + '/helpers/helper'))
    , FriendRequest = require(path.join(HOME + '/models/friendRequest'));

module.exports = function(app){
	app.io.route('addFriend',{
		addFriend: function(req, next){
            // id of friend
            var owner = req.data;
            // count unread friend request
            helper.countFriendRequest(owner, false, function(err, count){
                if(err) return next();

                console.log(count);
                req.io.room(owner).broadcast('updateFriendRequest',{toId:owner,count:count});
            });
		}
	});
}