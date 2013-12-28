/**
 * Created by Nova on 12/28/13.
 */

// format function
exports.formatPrivacy = function(privacy){
    console.log("formatPrivacy ne");
    if (privacy = 'p'){
        privacy = 'Private';
        console.log("private ne");
    }
    else if (privacy = 'g'){
        privacy = 'Group';
        console.log("group ne");
    }
    else if (privacy = 'c'){
        privacy = 'Close Community';
        console.log("close community ne");
    }
    else if (privacy = 'o'){
        privacy = 'Open Community';
        console.log("open community ne");
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