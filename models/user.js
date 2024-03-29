/**
 * Created by ConMeoMauDen on 15/12/2013.
 * 
 * Updated by Noir on 22/12/2013
 */
// Mongoose initialize:
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    path = require('path'),
    crypto = require('crypto');
var HOME = path.normalize(__dirname + '/..');
var validator = require(path.join(HOME + '/helpers/userValidator'));
var SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2*60*60*1000;

var userSchema = new Schema({
    local:{
        username:  {
            type: String
        },
        password:  {
            type: String
        },
        loginAttempts:{
            type: Number,
            default: 0
        }
    },
    facebook: {
        id: String,
        token: String,
        displayName: String,
        profileUrl: String,
        avatar: String,
        email: String
    },
    google:{
        id: String,
        refreshToken: String,
        accessToken: String,
        displayName: String,
        profileUrl: String,
        avatar: String,
        email: String
    },
    email: {
        type: String,
        lowercase: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    birthday:{
        type: Date
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ['male','female']
    },
    avatar: {
        type: String
    },
    aboutMe: String,
    location: String,
    workplace: String,
    isBanned: Boolean,
    createDate: {
        type: Date,
        default: Date.now
    },
    friend:[{
        userId      :   {
            type    :   Schema.Types.ObjectId,
            ref     :   'User'
        },
        isConfirmed :{
            type    :   Boolean,
            default :   false
        }
    }],
    hideList: [
        {
            eventID: {
                type: Schema.Types.ObjectId
                ,ref: 'eventDetails'
            }
        }
    ],
    group:[{
        name: String,
        listUser: [String]
    }],
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
    },
    provider:{
        type: String
    },
    lockUntil:{
        type: Number
    },
    token:{
        type: String,
        index: true
    }
});

userSchema.virtual('isLocked').get(function(){
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.virtual('fullName').get(function(){
    return this.lastName + " " + this.firstName;
});

userSchema.pre('save', function(next){
    var user = this;

    // only hash the password if it has been modified (or is new)
    if(!user.isModified('local.password'))
        return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err)
            return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.local.password, salt, function(err, hash){
            if(err)
                return next(err);

            // override the clear text password with the hashed one
            user.local.password = hash;
            next();
        });
    });
});

userSchema.methods.checkPassword = function(inputPassword, cb){
    bcrypt.compare(inputPassword, this.local.password, function(err, isMatch){
        if(err)
            return cb(err);

        cb(null, isMatch);
    });
};

userSchema.methods.incLoginAttempts = function(cb){
    // if we have a previous lock that has expired, restart at 1
    if(this.lockUntil && this.lockUntil < Date.now()){
        return this.update({
            $set:{'local.loginAttempts':1},
            $unset: {lockUntil:1}
        }, cb);
    }
    // otherwise we're incrementing
    var updates = {
        $inc:{
            'local.loginAttempts':1
        }
    }
    // lock the account if we've reached max attempts and it's not locked already
    if(this.local.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked){
        updates.$set = {lockUntil: Date.now() + LOCK_TIME };
    }

    return this.update(updates, cb);
};

// expose enum on the model and provide an internal convenience reference
var reasons = userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2,
    INPUT_REQUIRED: 3
};

userSchema.statics.authenticate = function(username, password, cb){
    if(!username && !password){
        return cb(null, null, reasons.INPUT_REQUIRED);
    }
    this.findOne({'local.username': username}, function(err, user){
        if(err) return cb(err);

        // make sure the user exists
        if(!user){
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if(user.isLocked){
            // just increment login attemtps if account is already locked
            return user.incLoginAttempts(function(err){
                if(err) return cb(err);

                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.checkPassword(password, function(err, isMatch){
            if(err) return cb(err);

            // check if the password was a match
            if(isMatch){
                // if there's no lock or failed attempts, just return the user
                if(!user.local.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attemtps and lock info
                var updates = {
                    $set: {'local.loginAttempts':0},
                    $unset: {lockUntil:1}
                };
                return user.update(updates, function(err){
                    if(err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attemps before responding
            user.incLoginAttempts(function(err){
                if(err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

// validation
userSchema.path('local.username').validate(validator.checkUnique('User','local.username'),'Someone already use that username. Try another?');
userSchema.path('email').validate(validator.checkUnique('User','email'), "That email has used somehow. Try another?");
userSchema.path('email').validate(validator.emailFormat, 'Invalid email format.');
userSchema.path('local.password').validate(validator.passwordLengthFormat, 'Password must have a length greater than 5.');
userSchema.path('local.password').validate(validator.passwordFormat, 'Password must not contain special character.');

module.exports = mongoose.model('User', userSchema);



