// Mongoose initialize:
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
// Model declaration
var conversationSchema = new Schema({
    participant: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            username: {
                type: String
            },
            avatar: {
                type: String
            },
            isRead:{
                type: Boolean,
                default: false
            },
            isSeen:{
                type: Boolean,
                default: false
            }
        }
    ],
    content:[
        {
            sender:{
                userId: {
                    type: Schema.Types.ObjectId,
                    ref:'User'
                },
                username:{
                    type: String
                },
                avatar:{
                    type: String
                }
            },
            message: {
                type: String
            },
            createDate:{
                type: Date,
                default: Date.now
            }
        }
    ],
    lastUpdatedDate:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);







