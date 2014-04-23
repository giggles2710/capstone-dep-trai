/**
 * Created by ThuanNH on 12/23/13.
 */
var path = require('path')
    , badWordList = require('../config/middlewares/badword')
    , User = require('../app/models/user')
    , Conversation = require('../app/models/conversation')
    , FriendRequest = require('../app/models/friendRequest');
var ObjectId = require('mongoose').Types.ObjectId;
var EventDetail = require("../app/models/eventDetail")

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
        embedded.name = user.usernameByProvider;
        if(query != null){
            // lowered case both embedded name and query
            query = query.toLowerCase();
            var tempName = embedded.name.toLowerCase();
            if(tempName.indexOf(query) > -1){
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
exports.mergeArray = function mergeArray(des, src){
    // if item is not exist in array 1, then push it in
    for(var i=0;i<src.length;i++){
        if(des.indexOf(src[i]) === -1){
            des.push(src[i]);
        }
    }
}

exports.mergeArrayObjectId = function mergeArrayObjectId(des, src){
    for(var i=0;i<src.length;i++){
        var equal = false;
        for(var j=0;j<des.length;j++){
            if(src[i].equals(des[j])){
                equal = true;
                break;
            }
        }
        if(!equal){
            des.push(src[i]);
        }
    }
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
        }else{
            // remove user from input
            input.splice(input.length-1,1);
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
            getUserFromTokenInput(input, output, cb);
        }
    });
}

exports.findUsersRelatedToEvent = function(post){
    // find the list of users who related to this post
    // merge those arrays:
    // - like list
    var likeList = [];
    if(post.like){
        // like format
        // userID and name
        for(var i=0;i<post.like.length;i++){
            var liker = post.like[i];
            likeList.push(liker.userID);
        }
    }
    // - share list
    var shareList = [];
    if(post.share){
        // share format
        // userID + name
        for(var i=0;i<post.share.length;i++){
            var sharer = post.share[i];
            shareList.push(sharer.userID);
        }
    }
    // - comment list
    var commentList = [];
    if(post.comment){
        // comment format
        // userId
        for(var i=0;i<post.comment.length;i++){
            var comment = post.comment[i];
            commentList.push(comment.userId);
        }
        // prevent duplicates
        commentList = this.preventDuplicates(commentList);
    }
    // - participant list
    var participantList = [];
    if(post.user){
        // user format
        // userID
        for(var i=0;i<post.user.length;i++){
            var participant = post.user[i];
            participantList.push(participant.userID);
        }
        // add creator
        participantList.push(post.creator.userID);
    }
    // merge those arrays
    var users = likeList;
    this.mergeArrayObjectId(users,shareList);
    this.mergeArrayObjectId(users,commentList);
    this.mergeArrayObjectId(users,participantList);
    return users;
}

exports.findMemberOfEvent = function(post){
    // - participant list
    var participantList = [];
    if(post.user){
        // user format
        // userID
        for(var i=0;i<post.user.length;i++){
            if(post.user[i].status =='confirmed'){
                var participant = post.user[i];
                participantList.push(participant.userID);
            }
        }
        // add creator
        participantList.push(post.creator.userID);
    }
    return participantList;
}

exports.findFriendOfCreator = function(userId){
    // - participant list
    var friendList = [];
    User.findOne({'_id':userId},function(err, user){
        if(err) return console.log(err);

        if(user){
            if(user.friend){
                for (var i = 0; i < user.friend.length; i++) {
                    friendList.push(user.friend[i].userId)
                }
            }
        }
    });
    return friendList;
}

exports.preventDuplicates = function preventDuplicates(list){
    for(var i = 0; i < list.length; i++) {
        for(var j = i + 1; j < list.length; j++) {
            if (list[i].equals(list[j])) {
                list.splice(j, 1);
                j--;
            }
        }
    }
    return list;
}

exports.makeConversationSeen = function makeConversationSeen(list,currentUserId,cb){
    if(list.length == 0){
        return cb(null);
    }

    var conversationId = list[0];
    Conversation.findOne({'_id':conversationId},function(err, conversation){
        if(err) return cb(err);

        for(var i=0;i<conversation.participant.length;i++){
            if(conversation.participant[i].userId == currentUserId){
                // make he saw that
                conversation.participant[i].isSeen = true;
                break;
            }
        }
        // update to database
        conversation.save(function(err){
            if(err) return cb(err);

            // splice list
            list.splice(0,1);
            // move to next item
            makeConversationSeen(list,currentUserId,cb);
        });
    });
}

exports.countBadWordInString = function countBadWordInString(str){
    if(str=='' || !str) return 0;

    var result = 0;
    for(var i=0;i<badWordList.badWordList.length;i++){
        var word = badWordList.badWordList[i];
        // find the number of appearance times in this string
        resultOnWord = (str.split(word.word).length - 1);
        // multiply it with its rate
        result += resultOnWord*(parseInt(word.rate));
    }
    return result;
}

exports.detectBadWordInEvent = function(event){
    var location = "";
    var result = {};
    // 1. name
    var countInName = this.countBadWordInString(event.name);
    // 2. description
    var countInDescription = this.countBadWordInString(event.description);
    // 3. announcement
    var countInAnnouncement = this.countBadWordInString(event.announcement);
    // 4. tag
    // 5. location
    var countInLocation = this.countBadWordInString(event.location);
    // 6. comment
    var countInComment = 0;
    if(event.comment.length > 0){
        for(var i=0;i<event.comment.length;i++){
            var comment = event.comment[i];
            countInComment += this.countBadWordInString(comment.content);
        }
    }
    // record location
    if(countInName>0) location+= "name";
    if(countInDescription>0) location+= " desc";
    if(countInAnnouncement>0) location += " anno";
    if(countInLocation>0) location += " loca";
    if(countInComment>0) location += " comm";
    // record bad word rate
    result.count = countInName + countInAnnouncement + countInDescription + countInLocation + countInComment;
    result.location = location;

    return result;
}

/**
 * thuannh
 * validate captcha
 *
 * @param response
 * @param ipSolver
 * @param cb
 */
exports.validateCaptcha = function(response,ipSolver,cb){
    var querystring = require('querystring');
    var config = require('../config/config');
    var http = require('http');
    // response result
    var INVALID_SITE_PRIVATE_KEY    =   'invalid-site-private-key'
        , INVALID_REQUEST_COOKIE    =   'invalid-request-cookie'
        , INCORRECT_CAPTCHA_SOL     =   'incorrect-captcha-sol'
        , CAPTCHA_TIMEOUT           =   'captcha-timeout'
        , RECAPTCHA_NOT_REACHABLE   =   'recaptcha-not-reachable';
    // make query string
    var data = querystring.stringify({
        privatekey  :   config.recaptchaPrivateKey,
        remoteip    :   ipSolver,
        challenge   :   response.challenge,
        response    :   response.response
    });
    // post options
    var options = {
        host: 'www.google.com',
        path: '/recaptcha/api/verify',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    // send request
    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.on('data',function(verifyResult){
            // split the answer with ' '
            var answer = verifyResult.replace(/\n/g, " ").split(' ');
            if(answer[0] == 'true'){
                // so the captcha is correct
                return cb(null,'OK');
            }else{
                var err = {text:'',code:0};
                // the captcha is incorrect
                if(answer[1].indexOf(INVALID_SITE_PRIVATE_KEY) == 0){
                    err.text = 'Google were not able to verify the private key.';
                }else if(answer[1].indexOf(INVALID_REQUEST_COOKIE) == 0){
                    err.text = 'The challenge parameter of the verify script was incorrect.';
                }else if(answer[1].indexOf(INCORRECT_CAPTCHA_SOL) == 0){
                    // this is user mistake
                    err.code = 1; // to change to appropriate language on client
                }else if(answer[1].indexOf(CAPTCHA_TIMEOUT) == 0){
                    // this is also user mistake
                    err.code = 2; // to change to appropriate language on client
                }else if(answer[1].indexOf(RECAPTCHA_NOT_REACHABLE) == 0){
                    err.text = 'reCAPTCHA never returns this error code. A plugin should manually return this code in the unlikely event that it is unable to contact the reCAPTCHA verify server.'
                }
                // return error
                return cb(err, null);
            }
        });
    });

    req.write(data);
    req.end();
}

/**
 * thuannh
 * convert the id array to the objectId array
 * @param idArray
 */
exports.parseIdArrayToObjectIdArray = function(idArray,nameField){
    if(idArray && idArray.length > 0){
        for(var i=0;i<idArray.length;i++){
            var idItem = idArray[i];
            var id = idItem[nameField];
            // parse to ObjectId
            var objectId = ObjectId(''+id);
            // replace the old idItem with a new objectId
            idArray[i] = objectId;
        }
    }
}

exports.preventDuplicatesInObjectArray = function(list,idNameField){
    if(list && list.length > 0){
        for(var i = 0; i < list.length; i++) {
            for(var j = i + 1; j < list.length; j++) {
                if (list[i][idNameField].equals(list[j]['_id'])) {
                    list.splice(j, 1);
                    j--;
                }
            }
        }
        return list;
    }
}

exports.createExampleEvent = function createExampleEvent(user, cb){

    if(!user){
        return cb(null, []);
    }
    event = new EventDetail({
        name: "Join In My9Time Now !",
        startTime: new Date(),
        endTime: new Date(),
        description: "My9time is a event-oriented social network with a lot of useful features that help people to manage their time, organize their daily activities and stay in contact with others. ",
        location: "Everywhere",
        privacy: 'p',
        creator: {
            avatar: user.avatar,
            fullName: user.fullName,
            username: user.local.username,
            userID: user._id
        }
    });
    event.save(function (err) {
        if(err){
            return cb(err, null);
        }

        return cb(null, 'OK');
    });
}