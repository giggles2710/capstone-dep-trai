var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var Url = mongoose.SchemaTypes.Url;

var MultipleLanguage = new Schema({
    content: {
        contentName:{
        type: String,
        required: true
        },
        title:[{
            language:{
                type: String
            }
        }]

    }
});

module.exports = mongoose.model('MultipleLanguage', MultipleLanguage);/**
/*
 * Created by Nova on 2/28/14.
 * for example
 * {'contentName': 'addFriend', 'title': {'en': 'send you a friend request', 'vn': 'muốn mời bạn kết bạn'} }
 * how to get data
 * MultipleLanguage.title['en']
 */
