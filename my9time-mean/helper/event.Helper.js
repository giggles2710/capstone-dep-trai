/**
 * Created by Nova on 12/28/13.
 */

// format function
exports.formatPrivacy = function(privacy){
    if (privacy = 'p'){
        privacy = 'Private';
    }
    else if (privacy = 'g'){
        privacy = 'Group';
    }
    else if (privacy = 'c'){
        privacy = 'Close Community';
    }
    else if (privacy = 'o'){
        privacy = 'Open Community';
    }
    return privacy;
}

exports.formatDate = function(date){
    var dd = ("0" + date.getDate()).slice(-2);
    var mm = ("0" + (date.getMonth() + 1)).slice(-2);
    var yy = date.getFullYear();
    var today = yy+'-'+mm+'-'+dd;
 return today;
}

