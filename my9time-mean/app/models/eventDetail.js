var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//CheckMe: TrungNM thêm vào
var path = require('path');
var HOME = path.normalize(__dirname + '/..');
var User = require(path.join(HOME + "/models/user"));
//CheckMe: sửa fullname --> fullName,   userId --> userID

var EmbeddedUser = new Schema({
    username: String,
    fullName: String,
    avatar: String
});
// Nghĩa đã sửa lại like và share thành từ EmbeddedUser thành array bình thường
var EventDetail = new Schema({
    name: String,
    startTime: {
        type:Date,
        default: Date.now
    },
    endTime: {
        type:Date,
        default: Date.now
    },
    description: String,
    like: [
        {
            userID: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String
        }
    ],
    user: [
        {
            avatar: {
                type: String,
                default: '/img/avatar/hoanhtrang.png'
            },
            fullName: String,
            username: String,
            userID: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            status: {
                type: String,
                default: 'waiting'
            },
            inviteRight: {
                type: Boolean,
                default: false
            },
            note: {
                title: String,
                content: String,
                lastUpdate: {
                    type: Date,
                    default: Date.now
                }
            }
        }
    ],
    comment: [
        {
            username: String, 
            fullName: String, 
            avatar: {
                type    : String, 
                default : '/img/avatar/meomeo.jpg'
            },
            content: String, 
            datetime: {
                type    : Date,
                default : Date.now
            }
        }
    ],
    photo: [String],
    announcement: String,
    tag: [String],
    share: [
        {
            userID: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String
        }
    ],
    creator: {
        avatar: String, 
        fullName: String, 
        username: String, 
        userID: {type: Schema.Types.ObjectId, ref: 'User'},
        note: {
            title: String,
            content: String,
            lastUpdate: {
                type: Date,
                default: Date.now
            }
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    privacy: String,
    file: String,
    cover: {
        type: String,
        default: "/img/event-cover.png"
    },
    location: String,
    color: String,
    alarm: {
        type: Boolean,
        default: false
    }
});

// virtual -- like number
EventDetail.virtual('likeNumber').get(function(){
    // count like
    if(this.like){
        return this.like.length;
    }else{
        return 0;
    }    
});

// virtual -- comment number
EventDetail.virtual('commentNumber').get(function(){
    // count like
    if(this.comment){
        return this.comment.length;
    }else{
        return 0;
    }    
});

// TrungNM Nghịch code Like - Unlike
// TODO: Hoàn thiện lại cái like
EventDetail.methods.likes = function (userID) {

    if (this.like.length !== 0) {
        for (var i = 0; i < this.like.length; i++) {
            if (this.like[i].userID.equals(userID)) {
                this.update({$pull: {like: {'userID': userID}}}, function (err) {
                    if (err) console.log(err);
                    console.log('Unlike');
                });
            } else {
                // TODO: sua lai name kia
                var push = {$push: {like: {'userID': userID, 'name': 'SIdaa'}}};
                this.update(push, function (err) {
                    if (err) console.log(err);
                    console.log('Liked')

                });
            }
        }
    } else {
        var push = {$push: {like: {'userID': userID, 'name': 'SIdaa'}}};
        this.update(push, function (err) {
            if (err) console.log(err);
            console.log('Liked')

        });
    }
};

module.exports = mongoose.model('EventDetail', EventDetail);