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
    startTime: Date,
    endTime: Date,
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
        {avatar: String, fullName: String, username: String, userID: {type: Schema.Types.ObjectId, ref: 'User'}, status: String, inviteRight: Boolean, note: {title: String, content: String, lastUpdate: Date}}
    ],
    comment: [
        {username: String, fullName: String, avatar: String, content: String, datetime: Date}
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
    creator: {avatar: String, fullName: String, username: String, userID: {type: Schema.Types.ObjectId, ref: 'User'}, note: {title: String, content: String, lastUpdate: Date}},
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    privacy: String,
    file: String,
    cover: String,
    location: String,
    alarm: {
        type: Boolean,
        default: false
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