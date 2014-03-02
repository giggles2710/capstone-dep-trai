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

exports.changeUserToEmbeddedArray = function changeUserToEmbeddedArray(sourceList,outputList,query,cb){
    if(sourceList.length == 0){
        return cb(null,outputList);
    }

    if(!outputList){
        var outputList = [];
    }

    var user = sourceList[0];
    User.findOne({'_id':user.userId},function(err, user){
        if(err) return cb(err,null);

        var embedded = {};
        embedded.id = user._id;
        if(user.local){
            embedded.name = user.local.username;
        }else{
            embedded.name = user.facebook.displayName ? user.facebook : user.google.displayName;
        }
        if(query != null){
            if(embedded.name.indexOf(query) > -1){
                // push it in
                outputList.push(embedded);
            }
        }else{
            outputList.push(embedded);
        }

        // delete just outputed user
        sourceList = sourceList.splice(1,sourceList.length);
        // call a recursive again
        changeUserToEmbeddedArray(sourceList,outputList,query,cb);
    });
}

/**
 * thuannh
 * merge 2 array into 1
 *
 * @param array1
 * @param array2
 * @param cb
 * @returns {*}
 */
exports.mergeArray = function(array1, array2, cb){
    var rs,cmp = [];
    // maybe this'll make us go faster.
    if(array1.length > array2.length){
        rs = array1;
        cmp = array2;
    }else{
        rs = array2;
        cmp = array1;
    }
    // if item is not exist in array 1, then push it in
    for(var i=0;i<cmp.length;i++){
        var temp = cmp[i];
        if(rs.indexOf(temp) === -1){
            rs.push(temp);
        }
    }
    return cb(null, rs);
}

exports.getUserInfoForArray = function getUserInfoForArray(input, output, cb){
    if(!output){
        output = [];
    }
    if(!input){
        return cb(null, []);
    }
    if(input.length == 0){
        return cb(null, output);
    }

    // find user information
    var id = input[input.length-1].userId;
    User.findOne({'_id':id},function(err, user){
        if(err){
            cb(err, null);
        }

        if(user){
            var tmp = {
                userId: user._id
            }
            var provider = user.provider;
            // if provider == facebook or google.get their display name.
            switch (provider){
                case "facebook":
                    tmp.username = user.facebook.displayName;
                    tmp.avatar = user.facebook.avatar;
                    break;
                case "google":
                    tmp.username = user.google.displayName;
                    tmp.avatar = user.google.avatar;
                    break;
                default :
                    tmp.username = user.local.username;
                    tmp.avatar = user.avatar;
                    break;
            }
            output.push(tmp);
            // remove user from input
            input.splice(input.length-1,1);
            // next user
            getUserInfoForArray(input, output, cb);
        }
    })
}

exports.getUserFromTokenInput = function getUserFromTokenInput(input, output, cb){
    if(!output){
        output = [];
    }
    if(!input){
        return cb(null, []);
    }
    if(input.length == 0){
        return cb(null, output);
    }

    // find user information
    var id = input[input.length-1];
    User.findOne({'_id':id},function(err, user){
        if(err){
            cb(err, null);
        }

        if(user){
            var tmp = {
                userId: user._id
            }
            var provider = user.provider;
            // if provider == facebook or google.get their display name.
            switch (provider){
                case "facebook":
                    tmp.username = user.facebook.displayName;
                    break;
                case "google":
                    tmp.username = user.google.displayName;
                    break;
                default :
                    tmp.username = user.local.username;
                    break;
            }
            output.push(tmp);
            // remove user from input
            input.splice(input.length-1,1);
            // next user
            getUserFromTokenInput(input, output, cb);
        }
    })
}
