/**
 * Created by Noir on 12/23/13.
 */
var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var helper = require(path.join(HOME + "/helpers/helper"));
var validator = require(path.join(HOME + "/helpers/userValidator"));

exports.login = function(req, res){
    res.render('users/login', {title: 'Log In',message:'',error: false});
}

exports.authenticate = function(req, res){
    User.authenticate(req.body.username, req.body.password, function(err, user, reason){
        if(err)
            return res.render('users/login',{message: req.flash('loginMessage','Something wrong happened.'), title:'Log In', error: true});

        if(user){
            // login success
            req.session.user = {
                id: user.get('id'),
                fullName: user.get('fullName'),
                provider: user.get('provider')
            }

            return res.redirect('/profileTest');
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        if(reason == reasons.INPUT_REQUIRED){
            return res.render('users/login',{message:'Enter your username/password.', title: 'Log In', error: true});
        }else{
            return res.render('users/login',{message:'The username or password you entered is incorrect.', title: 'Log In',error: true});
        }
    });
};

exports.signup = function(req, res){
    var models = {
        title: 'Register',
        dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: []
    };

    models.years = getAllYears();
    return res.render('users/signup',models);
};

exports.submitUser = function (req, res) {
    var validateMessage = validate(req.body.firstName, req.body.lastName, req.body.username, req.body.email, req.body.password, req.body.confirmPassword, req.body.date, req.body.month, req.body.year, req.body.gender);
    if (validateMessage === '') {
        var user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            birthday: new Date(req.body.year, req.body.month, req.body.date),
            gender: req.body.gender,
            provider: "local"
        });

        user.local.password = req.body.password;
        user.local.username = req.body.username;
        console.log('**' + req.body.username);

        user.save(function (err, user) {
            if (err){
                var errorMessage = helper.displayMongooseError(err);
                return res.send(500, errorMessage);
            }

            req.session.user = {
                id: user.get('id'),
                fullName: user.get('fullName'),
                provider: user.get('provider')
            };

            return res.send(200, 'OK');
        });
    }else{
        res.send(500, validateMessage);
    }
};

exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/loginTest');
}

exports.profileTest = function(req, res){
    var title ="Profile";
    var provider = "";
    var userModel = new User();
    if(req.session.user){
        // is logged in
        title = "Manage profile user " + req.session.user.fullName + " of " + req.session.user.provider;
        provider = req.session.user.provider;
        User.findOne({'_id':req.session.user.id}, function(err, user){
            if(err) return console.log(err);

            if(user){
                return res.render('users/profileTest', {title:title, user: user, provider: provider});
            }
        });


    }else{
        return res.render('users/profileTest', {title:title, user: "", provider: provider});
    }
}

exports.authenticateFacebook = function(passport){
    passport.authenticate('facebook',{scope: 'email'});
}

//exports.authenticateFacebookCallback = function(req, res){
//    passport.authenticate('facebook',function(){
//        console.log('im here');
//        // authenticated
//        req.session.user = {
//            id: req.user._id,
//            fullName: req.user.fullName,
//            provider: 'facebook'
//        }
//        res.redirect('/profileTest');
//    });
//}


// helper ============================================================================
function getAllYears(){
    var years = [];

    for(var i=new Date().getFullYear();i > new Date().getFullYear() - 110;i--){
        years.push(i);
    }

    return years;
}

function validate(firstName, lastName, username, email, password, confirmPassword, date, month, year, gender){
    if(firstName && lastName && username && email && password && confirmPassword && date!=0 && month!=0 && year!=0 && gender){
        // check password confirm
        if(!(password === confirmPassword)){
            return 'Confirm password is not a match.';
        }
        // check date valid
        if(!validator.checkDateValid(date, month, year)){
            return 'Birthday is invalid.';
        }

        return '';
    }

    return 'Please input all field.';
}

