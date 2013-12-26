/**
 * Created by ConMeoMauDen on 25/12/2013.
 */
var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var helper = require(path.join(HOME + "/helpers/helper"));
var validator = require(path.join(HOME + "/helpers/userValidator"));

// View All
exports.view = function (req, res) {
    req.session.user = {
        _id: '52ba9a7637d5e99c05000003',
        fullName: 'Nguyễn Minh Trung',
        provider: 'facebook'
    }
    User.find(function (err, data) {
        if (!err) {
            res.render('view', { title: 'View All User', data: data});
        } else {
            console.log('Error');
        }
    })
};

// Delete User
exports.delete = function (req, res) {
    var id = req.params.userID;
    console.log(id);
    User.remove({_id: id}, function (err) {
        if (!err) {
            console.log('Da xoa');
            res.redirect('view');
        } else {
            console.log('Sida');
        }
    })
};

// View Account Settings
exports.setting = function (req, res) {
    User.findOne({username: 'trungnmse90088'}, function (err, User) {
        if (err) console.log('Error findOne');

        res.render('setting', { title: 'Account Settings', user: User});

    })
}

// POST edit User
exports.edit = function (req, res) {
    User.findById(id, function (err, User) {
        if (err) return handleError(err);

        User.email = req.body.email;
        User.firstname = req.body.firstname;
        User.lastname = req.body.lastname;

        User.save(function (err) {
            if (err) return handleError(err);
            res.redirect('view');
        });
    })

}

// POST add user
exports.submitUser = function (req, res) {
    var validateMessage = validate(req.body.fullname, req.body.username, req.body.email, req.body.password, req.body.confirmPassword, req.body.date, req.body.month, req.body.year, req.body.gender);
    if (validateMessage === '') {
        var user = new User({
            username: req.body.username,
            password: req.body.password,
            fullname: req.body.fullname,
            email: req.body.email,
            birthday: new Date(req.body.year, req.body.month, req.body.date),
            gender: req.body.gender,
            provider: "local"
        });

        user.save(function (err, user) {
            if (err) {
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
    } else {
        res.send(500, validateMessage);
    }

};

// Get : Display Add new user page
exports.signup = function (req, res) {
    var models = {
        title: 'Register',
        dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        years: []
    };
    models.years = getAllYears();

    return res.render('signup', models);
};

// Get changPass
exports.changePass = function (req, res) {
    res.render('changepass', {title: 'Change Password'})
}

// Post changPass

exports.submitPass = function (req, res) {
    var validateMessage = validatePass(req.body.current, req.body.password, req.body.confirmPassword, req.session.user._id);
    if (validateMessage === '') {
    }
    console.log(validateMessage);
    res.redirect('view');

}

exports.loginTest = function (req, res) {
    var title = 'Express';
    var isLoggedIn = false;
    if (req.session.user) {
        title = req.session.user.fullName + " of " + req.session.user.provider;
        isLoggedIn = true;
    }
    return res.render('indexLoginTest', { title: title, isLoggedIn: isLoggedIn});
};


// helper ============================================================================

// Chức năng Validate
function validate(fullname, username, email, password, confirmPassword, date, month, year, gender) {
    console.log('Full name: ' + fullname);
    console.log('Username: ' + username);

    if (fullname && username && email && password && confirmPassword && date != 0 && month != 0 && year != 0 && gender) {
        // check password confirm
        if (!(password === confirmPassword)) {
            return 'Confirm password is not a match.';
        }
        // check date valid
        if (!validator.checkDateValid(date, month, year)) {
            return 'Birthday is invalid.';
        }

        return '';
    }
    return 'Please input all field.';
}

// Validate Change Password
function validatePass(current, password, confirmPassword, id) {
    console.log('Current:     ' + current);
    console.log('Password:    ' + password);
    console.log('RePassword:  ' + confirmPassword);
    console.log('ID:  ' + id);


    if (current && password && confirmPassword) {

        // check password confirm
        if (!(password === confirmPassword)) {
            return 'Confirm password is not a match.';
        }

        if (current === password) {
            return 'Your new password is too similar to your current password. Please try another password.';
        }

        // Check current password
        User.findById(id, function (err, User) {
            if (err) return 'Error WTF !';

            console.log('database:  ' + User.password);
            if (current === User.password) {
                User.password = password;
                User.save(function (err) {
                    if (err) return handleError(err);
                    console.log('Password Changed');

                } )

            } else return 'Wrong Current Password';
        })

    } else
        return 'Please input all field'

}

// Get Year
function getAllYears() {
    var years = [];

    for (var i = new Date().getFullYear(); i > new Date().getFullYear() - 110; i--) {
        years.push(i);
    }

    return years;
}