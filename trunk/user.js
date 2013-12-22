/**
 * Created by ConMeoMauDen on 15/12/2013.
 * 
 * Updated by Noir on 22/12/2013
 */
// Mongoose initialize:
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    username:  {
        type: String,
        required: true,
        index: {unique: true}
    },
    password:  {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        lowercase: true
    },
    birthday:{
        type: Date, 
        required: true
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['male','female']
    },
    avatar:String,
    aboutMe: String,
    location: String,
    workplace: String,
    isBanned: Boolean,
    createDate: {
        type: Date,
        default: Date.now
    },
    friend:[{
        username: String,
        fullname: String,
        avatar: String
    }],
    group:{
        name: String,
        listUser: [String]
    },
    todoList:{
        name: String,
        type: String,
        chore: {
            content: String,
            status: String,
            createDate:{
                type: Date,
                default: Date.now
            },
            doneDate: Date
        }
    }
});

module.exports = mongoose.model('User', userSchema);