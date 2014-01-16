/**
 * Created by ConMeoMauDen on 02/01/2014.
 *
 */

// Mongoose initialize:
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path'),
    HOME = path.normalize(__dirname + '/..'),
    validator = require(path.join(HOME + '/helpers/groupValidator'));

var groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    listUser: [{
        type: String
    }]
});


groupSchema.pre('save', function(next){

});

//
//userSchema.statics.authenticate = function(username, password, cb){
//    if(!username && !password){
//        return cb(null, null, reasons.INPUT_REQUIRED);
//    }
//    this.findOne({'local.username': username}, function(err, user){
//        if(err) return cb(err);
//
//        // make sure the user exists
//        if(!user){
//            return cb(null, null, reasons.NOT_FOUND);
//        }
//
//        // check if the account is currently locked
//        if(user.isLocked){
//            // just increment login attemtps if account is already locked
//            return user.incLoginAttempts(function(err){
//                if(err) return cb(err);
//
//                return cb(null, null, reasons.MAX_ATTEMPTS);
//            });
//        }
//
//        // test for a matching password
//        user.checkPassword(password, function(err, isMatch){
//            if(err) return cb(err);
//
//            // check if the password was a match
//            if(isMatch){
//                // if there's no lock or failed attempts, just return the user
//                if(!user.local.loginAttempts && !user.lockUntil) return cb(null, user);
//                // reset attemtps and lock info
//                var updates = {
//                    $set: {'local.loginAttempts':0},
//                    $unset: {lockUntil:1}
//                };
//                return user.update(updates, function(err){
//                    if(err) return cb(err);
//                    return cb(null, user);
//                });
//            }
//
//            // password is incorrect, so increment login attemps before responding
//            user.incLoginAttempts(function(err){
//                if(err) return cb(err);
//                return cb(null, null, reasons.PASSWORD_INCORRECT);
//            });
//        });
//    });
//};

// validation
userSchema.path('local.username').validate(validator.checkUnique('User','local.username'),'Someone already use that username. Try another?');
userSchema.path('email').validate(validator.checkUnique('User','email'), "That email has used somehow. Try another?");
userSchema.path('email').validate(validator.emailFormat, 'Invalid email format.');
userSchema.path('local.password').validate(validator.passwordLengthFormat, 'Password must have a length greater than 5.');
userSchema.path('local.password').validate(validator.passwordFormat, 'Password must not contain special character.');

module.exports = mongoose.model('Group', groupSchema);



