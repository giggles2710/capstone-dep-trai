/**
 * Created by Noir on 12/23/13.
 */
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
