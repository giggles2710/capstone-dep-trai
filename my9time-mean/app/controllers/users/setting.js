/**
 * Created by ConMeoMauDen on 25/12/2013.
 */
var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var helper = require(path.join(HOME + "/helpers/helper"));
var validator = require(path.join(HOME + "/helpers/userValidator"));
var fs = require('fs');
var im = require('imagemagick');

module.exports = function (app) {

    // =================================================================================
    // GET: /view - View All User
    app.get('/api/users/viewlall', function (req, res) {
        User.find(function (err, user) {
            if (!err) {
                res.jsonp(user);
            } else {
                console.log('Error');
            }
        });
    });

    // =================================================================================
    // GET: /user - View User Profile
    app.get('/user', function (req, res){
        res.redirect('profile');
    });

    // =================================================================================
    // GET: /profile - View User Profile
    app.get('/profile', function (req, res) {
        var title = "Profile";
        var provider = "";

        // Get userID from Session
        if (req.session.user) {
            // Is logged in
            title = "Profile of user " + req.session.user.fullName + " of " + req.session.user.provider;
            provider = req.session.user.provider;

            // Get User profile from Database

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
        // Create birthday selection
        var models = {
            title: 'User Profile',
            dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            years: []
        };
        models.years = validator.getAllYears();

        if (req.session.user) {
            // is logged in
            title = "Change Profile of user " + req.session.user.fullName + " of " + req.session.user.provider;
            provider = req.session.user.provider;

            // Get user data from database
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

    // =================================================================================
    // Post: /changeinfo - Change profile action
    // CheckMe: review lại Code đi
    app.post('/changeinfo', function (req, res) {
        // Check validate
        var validateMessage = validator.validateModify(req.body.firstName, req.body.lastName, req.body.email, req.body.date, req.body.month, req.body.year, req.body.gender);

        // Action area
        if (validateMessage === '') {
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                if (err) return 'Error WTF !';

                // Get Data from request - Save to Database
                var updates = {
                    $set: {'firstName': req.body.firstName,
                        'lastName': req.body.lastName,
                        'email': req.body.email,
                        'birthday': new Date(req.body.year, req.body.month, req.body.date),
                        'gender': req.body.gender}
                };
                user.update(updates, function (err) {
                    if (err) {
                        var errorMessage = helper.displayMongooseError(err);
                        return res.send(500, errorMessage);
                    }
                    // Successful
                    return res.send(200, 'OK');
                })
            })
        } else {
            res.send(500, validateMessage);
        }


    });

    // =================================================================================
    // GET: /delete/ - Delete User - Old school method
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
    // GET: /changepass - View change password page
    app.get('/changepass', function (req, res) {
        res.render('users/changepass', {title: 'Change Password'})
    });

    // =================================================================================
    // POST: /changepass - Change password action
    app.post('/changepass', function (req, res) {
        // Get parameters from Request
        var current = req.body.current;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;
        var id = req.session.user.id;

        // Validate Password
        var validateMessage = validator.validatePassword(current, password, confirmPassword);

        console.log('Validate Message:  ' + validateMessage);

        // Action Area
        if (validateMessage === '') {

            // Check current password - New password
            User.findOne({'_id': id}, function (err, User) {
                if (err) return 'Error WTF !';

                // Check if Current password = User password
                User.checkPassword(current, function (err, isMatch) {
                    if (isMatch) {
                        // Change and Save password
                        User.local.password = password;
                        User.save(function (err) {
                            if (err) {
                                var errorMessage = helper.displayMongooseError(err);
                                return res.send(500, errorMessage);
                            }
                            // Successful
                            return res.send(200, 'OK');
                        })
                    } else {
                        return res.send(500, 'Your password was incorrect');
                    }
                })
            })
        } else {
            res.send(500, validateMessage);
        }
    });

    // ================================================================================
    // Get: /avatarupload - Show avatar upload page
    app.get('/avatarupload', function (req, res) {
        User.findOne({'_id': req.session.user.id}, function (err, User) {
            res.render('users/avatarupload', { title: 'Avatar Upload Page', user: User});
        });

    });


    // ================================================================================
    // POST: /avatarupload - Upload avatar action
    app.post('/avatarupload', function (req, res) {

        /// If there's an error
        if (!req.files.avatar.name) {
            console.log("There was an error")
            res.redirect('profile');
        }
        // Resize avatar to 150x150
        im.resize({
            srcPath: req.files.avatar.path,
            dstPath: './public/uploaded/avatar/' + req.session.user.id + '.png',
            width: 150,
            height: 150
        }, function (err, stdout, stderr) {
            // TODO: Hiển thị thông báo lỗi Upload File type error, Ảnh GIF đc thì VIP
            if (err) {
                console.log('File Type Error !');
                res.redirect('profile');
            }



            // Successfully
            // Set User avatar link - Save to database
            var avatar = '/uploaded/avatar/' + req.session.user.id + '.png';
            var updates = {
                $set: {'avatar': avatar}
            };
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                user.update(updates, function (err) {
                    if (err) return console.log('Error');
                })
            });

            // Delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(req.files.avatar.path, function () {
                if (err) throw err;
            });

            res.redirect('profile');
        });


    });
}