/**
 * Created by Noir on 12/23/13.
 */
var path = require('path')
    , User = require('../app/models/user')
    , FriendRequest = require('../app/models/friendRequest');

exports.checkAuthenticate = function(req, res, next){
    var isAuthenticated = false;
    // validate
    if(req.session && req.session.user){
        var userId = req.session.user.id;
        // check user is available
        User.findOne({'_id':userId,'isBanned':true},function(err, user){
            if(err) return console.log(err);

            if(user){
                isAuthenticated = false;
            }else{
                isAuthenticated = true;
            }
            if(isAuthenticated){
                next();
            }else{
                return res.redirect('/login');
            }
        });
    }
}

exports.countFriendRequest = function(friendId, isRead, cb){
    FriendRequest.count({'to':friendId,'isRead':isRead},function(err, count){
        if(err) return cb(err);

        return cb(null, count);
    });
}


exports.displayMongooseError = function(mongooseErr){
    var prop, messages = [];
    for(prop in mongooseErr.errors){
        messages += mongooseErr.errors[prop].message + "\n";
    }

    return messages.trim();
}

exports.getEmbeddedUser = function(fullUser){
    var embeddedUser = {};
    if(fullUser.local.username){
        // if they are local user
        embeddedUser.username = fullUser.local.username;
        embeddedUser.avatar = fullUser.avatar;
    }else{
        var provider = fullUser.provider;
        // if provider == facebook or google.get their display name.
        switch (provider){
            case "facebook":
                embeddedUser.username = fullUser.facebook.displayName;
                embeddedUser.avatar = fullUser.facebook.avatar;
                break;
            case "google":
                embeddedUser.username = fullUser.google.displayName;
                embeddedUser.avatar = fullUser.google.avatar;
                break;
        }
    }
    // get fullName
    embeddedUser.fullName = fullUser.fullName;

    return embeddedUser;
}
