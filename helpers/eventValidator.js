/**
 * Created by Nova on 12/28/13.
 */
var mongoose = require('mongoose');

//kiểm tra các kí tự của tên. Độ dài chắc nên quy định ở ejs
exports.checkNameFormat = function(val){
    return (/^[a-zA-Z0-9&_\.\s-]$/i).test(val);
}

// kiểm tra ngày bắt đầu không được lớn hơn ngày kết thúc
exports.checkStartEnd = function(start,end){
    if(start > end){
        return false;
    }
    else return true;

}

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