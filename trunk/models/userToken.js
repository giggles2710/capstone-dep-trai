/**
 * Created by Noir on 12/27/13.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var TOKEN_EXPIRES_TIME = 2*60*60*1000;

var userTokenSchema = new Schema({
    // we will be looking up the UserToken by userId and token so we need
    // to add and index to these properties to speed up queries
    userId: {
        type: Schema.ObjectId,
        index: true
    },
    token:{
        type: String,
        index: true
    },
    createDate:{
        type: Date,
        default: Date.now
    },
    expires:{
        type: Date
    }
});

userTokenSchema.pre('save', function(next){
    var userToken = this;

    if(!userToken.isModified('token')) {
        console.log('im here then return');
        return next();
    }

    console.log('im here');
    // gen a token
    // create a random string
    crypto.randomBytes(48, function(ex, buf){
        // make the string url safe
        var token = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
        // embed the userId in the token, and shorten it
        userToken.token = userToken.userId + '|' + token.toString().slice(1,24);
        console.log('im here: '+ userToken.token);
        userToken.expires = Date.now() + TOKEN_EXPIRES_TIME;
        next();
    });
});

module.exports = mongoose.model('UserToken', userTokenSchema);
