var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//CheckMe: TrungNM thêm vào
var path = require('path');
var HOME = path.normalize(__dirname + '/..');
var User = require(path.join(HOME + "/models/user"));
var badWords = require('../../config/middlewares/badword');
//CheckMe: sửa fullname --> fullName,   userId --> userID

var EmbeddedUser = new Schema({
    username: String,
    fullName: String,
    avatar: String
});

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
            },
            highlight:{
                type: Boolean,
                default: false
            }
        }
    ],
    comment: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
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
        },
        highlight:{
            type: Boolean,
            default: false
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
    },
    report: [
        {
            reporter: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            reportDate: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isBanned: {
        type: Boolean,
        default: false
    },
    badWordNumber:{
        type: Number,
        default: 0
    },
    badWordLocation:{
        type: String,
        default: ""
    }
});

// virtual -- report number
EventDetail.virtual('reportNumber').get(function(){
    // count report
    if(this.report){
        return this.report.length;
    }else{
        return 0;
    }
})

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


module.exports = mongoose.model('EventDetail', EventDetail);