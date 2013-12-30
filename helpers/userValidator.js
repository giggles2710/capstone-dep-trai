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

exports.getAllYears = function(){
    var years = [];

    for(var i=new Date().getFullYear();i > new Date().getFullYear() - 110;i--){
        years.push(i);
    }

    return years;
}

exports.validate = function(firstName, lastName, username, email, password, confirmPassword, date, month, year, gender){
    if(firstName && lastName && username && email && password && confirmPassword && date!=0 && month!=0 && year!=0 && gender){
        // check password confirm
        if(!(password === confirmPassword)){
            return 'Confirm password is not a match.';
        }
        // check date ]
        // Checkme-Thuan: Tr mới chuyển từ validator.checkDateValide thành this.
        if(!this.checkDateValid(date, month, year)){
            return 'Birthday is invalid.';
        }

        return '';
    }

    return 'Please input all field.';
}

// =============================================================================================
// TrungNM Area

// Validate Password
exports.validatePassword = function(current, password, confirmPassword){
    if (current && password && confirmPassword) {

        // check password confirm
        if (!(password === confirmPassword)) {
            return 'Confirm password is not a match.';
        }

        if (current === password) {
            return 'Your new password is too similar to your current password. Please try another password.';
        }

        return '';

    } else return 'Please input all field';

}

// Check validate for modify information
exports.validateModify = function(firstName, lastName, email,date, month, year, gender){
    if(firstName && lastName && email && date!=0 && month!=0 && year!=0 && gender){
        // Check date
        if(!this.checkDateValid(date, month, year)){
            return 'Birthday is invalid.';
        }

        // Check email format
        if(!this.emailFormat(email)){
            return 'Invalid email format.';
        }
        return '';
    }
    return 'Please input all field.';
}

