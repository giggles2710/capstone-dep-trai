/**
 * Created by Noir on 12/23/13.
 */
var mongoose = require('mongoose');

exports.checkUnique = function(modelName, field){
    return function(val, cb){
        if(val && val.length){
            // if string not empty/null
            // only for a new docs
            if(this.isNew){
                mongoose.models[modelName].where(
                    field, new RegExp('^'+val+'$','i')
                ).count(function(err, n){
                        // false when validations fail
                        cb(n<1);
                    });
            }else{
                cb(true);
            }
        }else{
            // raise error of unique if empty
            // may be confusing, but is rightful
            cb(false);
        }
    }
}

exports.emailFormat = function(val){
    return (/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i).test(val);
}

exports.passwordLengthFormat = function(val){
    if(val){
        return val.length > 5;
    }
    return true;

}

exports.passwordFormat = function(val){
    if(val){
        return !(/\W+/).test(val);
    }
    return true;
}

exports.checkDateValid = function(date, month, year){
    return new Date(year, month, 0).getDate() >= date;
}



