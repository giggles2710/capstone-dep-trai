var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
//var Email = mongoose.SchemaTypes.Email;
var SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2*60*60*1000;

var adminSchema = new Schema({
	email: {
		type: String,
		required: true,
		index: { unique: true }
	},
	username: {
		type: String,
		required: true,
		index: { unique: true }
	},
	password: {
		type: String,
		required: true
	},
    loginAttempts:{
        type: Number,
        default: 0
    },
    lockUntil:{
        type: Number
    },
    language:{
        type: String,
        default: 'vi'
    }
});

// expose enum on the model and provide an internal convenience reference
var reasons = adminSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2,
    INPUT_REQUIRED: 3
};

adminSchema.virtual('isLocked').get(function(){
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

adminSchema.pre('save', function(next){
    // only hash the password if it has been modified (or is new)
    if(!this.isModified('password'))
        return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err)
            return next(err);

        // hash the password using our new salt
        bcrypt.hash(this.password, salt, null, function(err, hash){
            if(err)
                return next(err);

            // override the clear text password with the hashed one
            this.password = hash;
            next();
        });
    });
});

adminSchema.methods.checkPassword = function(inputPassword, cb){
    bcrypt.compare(inputPassword, this.password, function(err, isMatch){
        if(err)
            return cb(err);

        cb(null, isMatch);
    });
};

adminSchema.methods.incLoginAttempts = function(cb){
    // if we have a previous lock that has expired, restart at 1
    if(this.lockUntil && this.lockUntil < Date.now()){
        return this.update({
            $set:{'loginAttempts':1},
            $unset: {lockUntil:1}
        }, cb);
    }
    // otherwise we're incrementing
    var updates = {
        $inc:{
            'loginAttempts':1
        }
    }
    // lock the account if we've reached max attempts and it's not locked already
    if(this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked){
        updates.$set = {lockUntil: Date.now() + LOCK_TIME };
    }

    return this.update(updates, cb);
};



module.exports = mongoose.model('Admin', adminSchema);