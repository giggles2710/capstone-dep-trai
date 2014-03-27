var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    SALT = '$2a$10$i9LcZ4fFIeFoo4ji7onCdO';
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
    var admin = this;
    console.log('password pre-save: '+this.password);
    // only hash the password if it has been modified (or is new)
    if(!admin.isModified('password'))
        return next();

    // generate a salt
    // hash the password using our new salt
    bcrypt.hash(this.password, SALT, null, function(err, hash){
        if(err)
            return next(err);

        // override the clear text password with the hashed one
        admin.password = hash;
        console.log('password: '+admin.password);
        next();
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

adminSchema.statics.authenticate = function(username, password, cb){
    if(!username && !password){
        return cb(null, null, reasons.INPUT_REQUIRED);
    }
    this.findOne({'username': username}, function(err, admin){
        if(err) return cb(err);

        // make sure the user exists
        if(!admin){
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if(admin.isLocked){
            // just increment login attemtps if account is already locked
            return admin.incLoginAttempts(function(err){
                if(err) return cb(err);

                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        admin.checkPassword(password, function(err, isMatch){
            if(err) return cb(err);

            // check if the password was a match
            if(isMatch){
                // if there's no lock or failed attempts, just return the user
                if(!admin.loginAttempts && !admin.lockUntil) return cb(null, admin);
                // reset attemtps and lock info
                var updates = {
                    $set: {'loginAttempts':0},
                    $unset: {lockUntil:1}
                };
                return admin.update(updates, function(err){
                    if(err) return cb(err);
                    console.log('admin: ' + JSON.stringify(admin));
                    return cb(null, admin);
                });
            }

            // password is incorrect, so increment login attemps before responding
            admin.incLoginAttempts(function(err){
                if(err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

module.exports = mongoose.model('Admin', adminSchema);