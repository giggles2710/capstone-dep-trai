/**
 * Created by ConMeoMauDen on 25/12/2013.
 */
var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var helper = require(path.join(HOME + "/helpers/helper"));
var validator = require(path.join(HOME + "/helpers/userValidator"));


module.exports = function (app, passport) {

    // =================================================================================
    // GET: /view - View All User
    app.get('/view', function (req, res) {
        User.find(function (err, data) {
            if (!err) {
                res.render('users/view', { title: 'View All User', data: data});
            } else {
                console.log('Error');
            }
        })
    });


    // =================================================================================
    // GET: /profile - View User Profile

    app.get('/profile', function (req, res) {
        var title = "Profile";
        var provider = "";

        // Get userID from Session
        if (req.session.user) {
            // is logged in
            title = "Profile of user " + req.session.user.fullName + " of " + req.session.user.provider;
            provider = req.session.user.provider;
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                if (err) return console.log(err);

                if (user) {
                    return res.render('users/profile', {title: title, user: user, provider: provider});
                }
            });
        } else {
            return res.render('users/profile', {title: title, user: "", provider: provider});
        }
    });

    // =================================================================================
    // GET: /changeinfo - View change profile page
    app.get('/changeinfo', function (req, res) {
        // Get userID from Session
        console.log('DM gay');
        // Create birthday selection
        var models = {
            title: 'Register',
            dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            years: []
        };

        if (req.session.user) {
            // is logged in
            title = "Change Profile of user " + req.session.user.fullName + " of " + req.session.user.provider;
            provider = req.session.user.provider;
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                if (err) return console.log(err);

                if (user) {
                    return res.render('users/changeinfo', {title: title, user: user, provider: provider, models: models});
                }
            });
        } else {
            return res.render('users/changeinfo', {title: 'Aloha', user: "", provider: provider, models: models});
        }
    });
    app.post('/changeinfo', function (req, res) {
        console.log(req.body);
        User.findOne({'_id': req.session.user.id}, function (err, User) {
            if (err) return 'Error WTF !'; else {
                User.lastName = req.body.lastName;
                User.firstName = req.body.firstName;
                User.email = req.body.email;
                User.birthday = new Date(req.body.year, req.body.month, req.body.date);

                console.log('User:  ' + User);
                User.save(function (err) {
                    if (err) {
                        var errorMessage = helper.displayMongooseError(err);
                        return res.send(500, errorMessage);
                    }
                    return res.send(200, 'OK');
                    console.log('Password Changed');
                })

            }
        })


    })
    // =================================================================================
    // Post: /profile - change profile action
    app.post('/submitChange', function (req, res) {
        // Get userID from Session
        console.log('Body: 2 ' + req.body);

//    User.findById(req.session._id, function (err, User) {
//        if (err) return handleError(err);
//
//        User.email = req.body.email;
//        User.firstname = req.body.firstname;
//        User.lastname = req.body.lastname;
//        User.birthday = req.body.birthday;
//        User.gender = req.body.gender;
//
//        User.save(function (err) {
//            if (err) return handleError(err);
//            res.redirect('view');
//        });
//    })
    });

    // =================================================================================
    // GET: /delete/ - Delete User
    app.get('/delete/:userID', function (req, res) {
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
    });

    // =================================================================================
    // GET: /edit/ - Edit User
//    exports.edit = function (req, res) {
//        User.findById(id, function (err, User) {
//            if (err) return handleError(err);
//
//            User.email = req.body.email;
//            User.firstname = req.body.firstname;
//            User.lastname = req.body.lastname;
//
//            User.save(function (err) {
//                if (err) return handleError(err);
//                res.redirect('view');
//            });
//        })
//
//    }

    // =================================================================================
    // GET: /changepass - View change password page
    app.get('/changepass', function (req, res) {
        res.render('users/changepass', {title: 'Change Password'})
    });

    // =================================================================================
    // POST: /changepass - Change password action
    app.post('/changepass', function (req, res) {
        var current = req.body.current;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;
        var id = req.session.user.id;

        var validateMessage = validatePass(current, password, confirmPassword);

        console.log('Validate Message:  ' + validateMessage);


        if (validateMessage === '') {
            console.log('Yolo');
            // Check current password - password
            User.findOne({'_id': id}, function (err, User) {
                if (err) return 'Error WTF !';

                User.checkPassword(current, function (err, isMatch) {
                    if (isMatch) {
                        // Change and Save password
                        User.local.password = password;
                        User.save(function (err) {
                            if (err) {
                                var errorMessage = helper.displayMongooseError(err);
                                return res.send(500, errorMessage);
                            }
                            return res.send(200, 'OK');
                            console.log('Password Changed');
                        })
                    }
                })
            })
        } else {
            console.log('yolo 2');
            res.send(500, validateMessage);
        }
    });


// helper ============================================================================

//Chức năng Validate
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

//Validate Change Password
    function validatePass(current, password, confirmPassword) {
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

// Get Year
    function getAllYears() {
        var years = [];

        for (var i = new Date().getFullYear(); i > new Date().getFullYear() - 110; i--) {
            years.push(i);
        }
        return years;
    }
}