/**
 * Created by ConMeoMauDen on 11/02/2014.
 */

/**
 * Created by Noir on 12/23/13.
 */

/**
 * added by Nova on 5/3/14.
 */

/**
 *
 * Summary
 *
 * GET  :       /loginMenu
 * GET  :       /login
 * POST :       /login
 * GET  :       /auth/facebook
 * GET  :       /auth/facebook/callback
 * GET  :       /auth/google
 * GET  :       /auth/google/callback
 * GET  :       /signup
 * POST :       /signup
 * GET  :       /profile
 * GET  :       /logout
 * POST :       /recovery
 * POST :       /recovery/checkUsername
 * POST :       /recovery/checkContact
 * GET  :       /resetPassword/:token
 * GET  :       /resetPassword
 *
 *
 */
'use strict'

var path = require('path')
    , User = require("../../models/user")
    , UserToken = require("../../models/userToken")
    , helper = require("../../../helper/helper")
    , mailHelper = require("../../../helper/mailHelper")
    , validator = require("../../../helper/userValidator")
    , fs = require('fs')
    , fsx = require('fs-extra')
    , im = require('imagemagick')
    , easyimg = require('easyimage');
var mongoose = require('mongoose');
var EventDetail = require("../../models/eventDetail");
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('lodash');

/**
 * ===============================================================================
 * Update Languages
 * NghiaNV - 5/3/2014
 */
exports.changeLanguage = function (req, res) {
    User.findOne({'_id': req.session.passport.user.id}, function (err, user) {
        user.language = req.body.language;
        //console.log("req.body.language :" + req.body.language);
        user.save(function (err, user) {
            if (err) {
                var errorMessage = helper.displayMongooseError(err);
                return res.send(500, errorMessage);
            }
            console.log("user.language : " + user.language)
        });

    });
}
exports.getLanguage = function (req, res) {
    User.findOne({'_id': req.session.passport.user.id}, function (err, user) {
        res.send(200, {'language': user.language});

    });
}


/**
 * ===============================================================================
 * checkIsNullProfile
 * NghiaNV - 5/3/2014
 */
exports.checkIsNullProfile = function (req, res) {
    console.log("Is NullProfile Fucn");
    var isNullProfile = false;
    User.findOne({'_id': req.body.userID}, function (err, user) {
        if (user) {
            if (user.isBanned == true) {
                isNullProfile = true;
            }
            else isNullProfile = false
        }
        else {
            isNullProfile = true;
        }
        //console.log("isNullProfile" + isNullProfile);
        res.send(isNullProfile);
    });
}


/**
 * ===============================================================================
 * get Current Profile
 * NghiaNV - 25/3/2014
 */
exports.getCurProfile = function (req, res) {

    User.findOne({'_id': req.query.userID}, function (err, user) {
        if (user) {
            res.send({location: user.location,
                occupation: user.occupation,
                workplace: user.workplace,
                studyPlace: user.studyPlace,
                showBirthday: user.showBirthday,
                aboutMe: user.aboutMe,
                useLanguage: user.useLanguage,
                firstName: user.firstName,
                lastName: user.lastName});
        }
    });
}


//Khu vuc cua Minh o duoi
exports.getTodo = function (req, res, next) {
    User.findOne({'_id': req.params.id}, function (err, user) {
        if (err) {
            return next();
        }
        return res.send(user);
    });
}

exports.addTodo = function (req, res) {
    var content = req.body.content;
    var idTodo = mongoose.Types.ObjectId();
    var updates = {
        $push: {todoList: {
            '_id': idTodo,
            'content': content,
            'status': false
        }}
    };
    User.findOne({'_id': req.session.passport.user.id}, function (err, user) {
        user.update(updates, function (err) {
            if (err) return console.log('Error');
        })
    });
    res.send(200, {idTodo: idTodo, content: content});
};

// TrungNM: Recode for Mobile
exports.addTodoMobile = function (req, res) {
    var content = req.body.content;
    var userId = req.body.userId;
    var idTodo = mongoose.Types.ObjectId();
    var updates = {
        $push: {todoList: {
            '_id': idTodo,
            'content': content,
            'status': false
        }}
    };
    User.findOne({'_id': userId}, function (err, user) {
        user.update(updates, function (err) {
            if (err) return console.log('Error');
        })
    });
    res.send(200, {idTodo: idTodo, content: content});
};

exports.removeTodo = function (req, res) {
    //console.log(JSON.stringify(req.body.todo));
    User.update({'_id': req.session.passport.user.id},
        {
            $pull: {
                todoList: {_id: req.body.todo._id}

            }
        }, function (err, user) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something Wrong !')
            }
        })
};

// TrungNM: Recode for Mobile
exports.removeTodoMobile = function (req, res) {
    User.update({'_id': req.body.userId},
        {
            $pull: {
                todoList: {_id: req.body.todo._id}

            }
        }, function (err, user) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something Wrong !')
            }
        })
};

exports.changeStatusTodo = function (req, res) {
    var updates = '';
    if (req.body.todo.status == true) {
        updates = {
            $set: {'todoList.$.status': false}
        };

    } else {
        updates = {
            $set: {'todoList.$.status': true}
        };
    }

    User.update({'todoList._id': req.body.todo._id}, updates, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something Wrong !')
        }

//        res.send(200, {statusTodo: });
        //console.log("2222");
        //console.log(user);
    })
    if (req.body.todo.status == true) {
        res.send(200, {statusTodo: "false"});
    } else {
        res.send(200, {statusTodo: "true"});
    }
};

// TrungNM: Recode for Mobile
exports.changeStatusTodoMobile = function (req, res) {
    var updates = '';
    if (req.body.todo.status == true) {
        updates = {
            $set: {'todoList.$.status': false}
        };

    } else {
        updates = {
            $set: {'todoList.$.status': true}
        };
    }

    User.update({'todoList._id': req.body.todo._id}, updates, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something Wrong !')
        }

        console.log(user);
    })
    if (req.body.todo.status == true) {
        res.send(200, {statusTodo: "false"});
    } else {
        res.send(200, {statusTodo: "true"});
    }
};


exports.checkRecoveryToken = function (req, res, next) {
    // check token is valid
    var token = req.params.token;
    var title = 'Reset password';
    UserToken.findOne({'token': token}, function (err, userToken) {
        if (err) {
            console.log(err);
            return next();
        }

        // found this token
        if (userToken) {
            // check if this userToken is expires or not
            if (userToken.expires < Date.now())
                return res.send(400, 'Your request is expired');
            // this still is available
            // reset password and render page to user input new password
            return res.send(200, {userId: userToken.userId});
        } else {
            return res.redirect('/404');
        }
    });
}


/**
 * ThuanNH
 *
 * check email of this user, if it's owned by this user
 * create a recovery token, then send it via email
 *
 * @param req
 * @param res
 * @param next
 */
exports.checkRecoveryEmail = function (req, res, next) {
    // check this email if it's belong to this user
    // mongodb query: db.users.find({email:1.99, $or: [ { qty: { $lt: 20 } }, { sale: true } ] } )
    User.findOne({'local.username': req.params.username, 'email': req.params.email}, function (err, user) {
        if (err)
            return console.log(err);

        //console.log('im here 1 ' + JSON.stringify(user));
        if (user) {
            //console.log('im here 2');
            // user is match
            // create a token
            var userToken = new UserToken({
                userId: user._id,
                token: ''
            });

            userToken.save(function (err, userToken) {
                if (err) return res.send(500, err);
                var resetUrl = 'http://localhost:8080/passwordrecover/' + userToken.token + '';
                // send a mail to their email and render success page
                mailHelper.sendResetPasswordMail(user.email, resetUrl, userToken.createDate, function (err, responseStatus, http, text) {
                    if (err) return console.log(err);

                    return res.send(200, 'Message send successfully');
                });
            });
        } else {
            //console.log('im here 3');
            // user and email is not a match
            // display an error message
            return res.send(500, 'This is not your email address. Please enter the email address you registered to us');
        }
    });
}
/**
 * ThuanNH added
 *
 * check session
 *
 * @param req
 * @param res
 * @param next
 * @returns {*|Transport|EventEmitter|boolean|Request|ServerResponse}
 */
exports.checkSession = function (req, res, next) {
    var isFirstTime = req.params.isFirstTime;
    if (req.session.passport.user) {
        // is authenticated
        // then check user is available or not
        if (!isFirstTime) {
            // check user is available or not
            User.findOne({'_id': req.session.passport.user.id}, function (err, user) {
                if (err) {
                    return next();
                }

                if (user) {
                    if (user.isLocked) {
                        // user is locked
                        req.logout();
                        return res.send(400);
                    } else {
                        return res.send(200, {id: req.session.passport.user.id, username: req.session.passport.user.username});
                    }
                } else {
                    req.logout();
                    return res.send(400);
                }
            })
        } else {
            return res.send(200, {id: req.session.passport.user.id, username: req.session.passport.user.username});
        }
    } else {
        return res.send(400);
    }
}
/**
 * ThuanNH added
 *
 * update user
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateUser = function (req, res, next) {
    //console.log('im here 1');
    //console.log('params ' + JSON.stringify(req.params));
    //console.log('body ' + JSON.stringify(req.body));
}
/**
 * check unique for username and email
 *
 * @param req
 * @param res
 * @param next
 */
exports.checkUnique = function (req, res, next) {
    var str = req.body.target;
    var type = req.body.type;
    str.toLowerCase();
    var query = (type == 'username') ? {'local.username': str} : {'email': str};

    //console.log('target: ' + str + ' type: ' + type + ' query: ' + JSON.stringify(query));
    User.count(query, function (err, n) {
        if (err) return console.log(err);

        if (n < 1) {
            // doesn't exist
            return res.send(200, true);
        } else {
            // existed
            return res.send(500, false);
        }
    });
};

/**
 * log out
 *
 * @param req
 * @param res
 * @param next
 */
exports.logout = function (req, res, next) {
    req.logout();
    return res.redirect('/');
};

/**
 * create a new account then log in
 *
 * @param req
 * @param res
 * @param next
 */
exports.signup = function (req, res, next) {
    //console.log(':::' + JSON.stringify(req.body));

    User.findOne({$or: [
        {'facebook.email': req.body.email},
        {'email': req.body.email}
    ]
    }, function (err, user) {
        if (err) return res.send(500, "Something wrong happened. Please try again.");


        if (user) {
            // update this user
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.birthday = new Date(req.body.year, req.body.month, req.body.date);
            user.gender = req.body.gender;
            user.provider = "local";
            user.local.password = req.body.password;
            user.local.username = req.body.username;
            user.email = req.body.email;
            user.birthday = new Date(req.body.year, req.body.month, req.body.date)

            user.save(function (err, user) {
                if (err) {
                    var errorMessage = helper.displayMongooseError(err);
                    return res.send(500, errorMessage);
                }

                req.logIn(user, function (err) {
                    if (err) return next(err);
                    return res.redirect('/'); // created -> login -> redirect to this page
                });
            });
        } else {
            // create new user
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

            user.save(function (err, user) {
                if (err) {
                    var errorMessage = helper.displayMongooseError(err);
                    return res.send(500, errorMessage);
                }

                req.logIn(user, function (err) {
                    if (err) return next(err);
                    return res.redirect('/'); // created -> login -> redirect to this page
                });
            });
        }
    });
};

exports.updateUser = function (req, res, next) {
    //console.log(JSON.stringify(req.params));
    return next();
}

exports.findOneUser = function (req, res, next) {
    User.findOne({'_id': req.params.id}, function (err, user) {
        if (err) {
            console.log('**' + err);
            return next();
        }

        return res.send(user);
    });
}

exports.initUser = function (req, res, next) {
    fsx.readFile('db.json', 'utf-8', function (err, rawMenu) {
        if (err)
            console.log("** Read file error: " + err);
        else {
            var data = JSON.parse(rawMenu);
            for (var i = 0; i < data.length; i++) {
                // user.birthday = new Date(req.body.year, req.body.month, req.body.date);
                var birthday = new Date(data[i].year, data[i].month, data[i].date);
                new User({
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    birthday: birthday,
                    'local.username': data[i].username,
                    'local.password': data[i].password,
                    gender: data[i].gender,
                    provider: data[i].provider,
                    email: data[i].email
                }).save(function (err) {
                        if (err) {
                            console.log("** " + err);
                            res.send('ERR');
                        }
                    });
            }
            console.log('Init done...');
            User.find(function (err, users) {
                if (!err)
                    res.send(users);
            });
        }
    });
}

exports.destroyUser = function (req, res, next) {
    User.remove({}, function (err) {
        if (err) return console.log(err);

        return res.redirect('/');
    });
}


/**
 * TrungNM - View Profile of User
 * URL: 'api/profile'
 */
exports.viewProfile = function (req, res, next) {
    //console.log(JSON.stringify(req.body));
    User.findOne({'_id': req.params.id}, function (err, user) {
        // Nếu có lỗi
        if (err) {
            return next();
        }
        // Nếu thành công
        return res.send(user);
    });
}

exports.phoneLogin = function (req, res, next) {
    //console.log(JSON.stringify(req.body));
}

/**
 * TrungNM - Edit Profile
 * URL: 'api/users/edit'
 */
//exports.editProfile = function(req, res, next){
//    User.findOne({'_id':req.session.passport.user.id}, function(err, user){
//        user.firstName = req.body.firstName;
//        user.lastName = req.body.lastName;
//        user.birthday = new Date(req.body.year, req.body.month, req.body.date);
//        user.gender = req.body.gender;
//        user.email = req.body.email;
//
//        user.save(function (err, user) {
//            if (err){
//                var errorMessage = helper.displayMongooseError(err);
//                return res.send(500, errorMessage);
//            }
//
//            req.logIn(user, function(err){
//                if(err) return next(err);
//                return res.redirect('profile');
//            });
//        });
//
//    });
//}

/**
 * NghiaNV - Edit Profile
 * URL: 'api/users/edit'
 */
exports.editProfile = function (req, res) {
    User.findOne({'_id': req.body.userID}, function (err, user) {
        if (user) {
            user.location = req.body.location;
            user.occupation = req.body.occupation;
            user.workplace = req.body.workplace;
            user.studyPlace = req.body.studyPlace;
            user.aboutMe = req.body.aboutMe;
            user.lastName = req.body.lastName;
            user.firstName = req.body.firstName;
            if (!user.showBirthday) {
                user.showBirthday = 'y';
            }
            if (req.body.showBirthday != '' && req.body.showBirthday) {
                user.showBirthday = req.body.showBirthday;
            }
            if (!user.useLanguage) {
                user.useLanguage = '';
            }
            if (req.body.useLanguage) {
                user.useLanguage = req.body.useLanguage;
            }

            user.save(function (err, user) {
                if (user) {
                    res.send(user);
                }
                else {
                    var errorMessage = helper.displayMongooseError(err);
                    return res.send(500, errorMessage);
                }
            });
        }
        else res.send(500, 'Error');


    });
}

/**
 * TrungNM - Delete User
 * URL: 'api/users/delete/:id'
 */
exports.deleteUser = function (req, res, next) {
    var id = req.params.userID;
    //console.log('Delete user:  ' + id);
    User.remove({'_id': id}, function (err, user) {
        // Nếu có lỗi
        if (err) {
            return next();
        }
        // Nếu thành công
        return res.redirect('/profile');
    });
}

/**
 * TrungNM - Upload Avatar
 * URL: 'api/users/uploadAvatar'
 */

exports.cropAvatar = function (req, res, next) {
    var selected = req.body.selected;
    var userID = req.session.passport.user.id;
    //console.log('Crop avatar   ' + JSON.stringify(selected));

    easyimg.crop(
        {
            src: './public/img/avatar/' + userID + '.png', dst: './public/img/avatar/' + userID + '.png',
            cropwidth: selected.w, cropheight: selected.h,
            gravity: 'NorthWest',
            x: selected.x, y: selected.y
        },
        function (err, image) {
            if (err) throw err;
        }
    );
    res.send(200);


}

exports.uploadAvatar = function (req, res, next) {
    var file = req.files.file;
    var userID = req.session.passport.user.id;
    //console.log(file.path);

    fsx.copy(file.path, 'public/img/avatar/' + userID + '.png', function (err) {
        // Nếu có lỗi, thông báo
        if (err) {
            console.log('Error:  ' + err);
        }
        fs.unlink(file.path, function (err) {
            if (err) console.log(err);

        })
        res.send(200);
    });


}

// TODO: Kiểm tra lại Upload nhiều file, phân chia lưu file như thế nào ?
exports.multipleFileUpload = function (req, res) {
    var file = req.files.file;
    var userID = req.session.passport.user.id;
    var eventID = req.body.eventID;
    // Tạo ra 1 id cho ảnh
    var idImage = mongoose.Types.ObjectId();

    fsx.copy(file.path, 'public/img/events/' + userID + '_' + eventID + '_' + idImage + '.png', function (err) {
        if (err) {
            console.log('Error:  ' + err);
        }

        // Nếu xử lí file thành công
        // Chuẩn bị Query để thêm comment vào event
        var updates = {
            $push: {
                'photo': '/img/events/' + userID + '_' + eventID + '_' + idImage + '.png'
            }
        };
        // Ghi vao database
        EventDetail.update({'_id': eventID }, updates, function (err) {
            if (err) {
                console.log(err);
                res.send(500, 'Something Wrong !');
            }
            res.send(200);
        });
    });

    // Nếu thành công gửi hàng về đồng bằng
    res.send(200);
}

// TODO: Code test cho Phone
exports.phoneUser = function (req, res) {
    User.findOne({'_id': '52f9d20adc2149801a21bbc7'}, function (err, user) {
        // Nếu có lỗi
        if (err) {
            return next();
        }
        // Nếu thành công
        return res.send(user);
    });
}


/**
 * Nghĩa - get all friends info
 * 19/3/2014
 */
exports.getFriendInfo = function (req, res) {
    var id = req.body.userID;
    console.log('Get friend info:  ');
    var friendIDArray = [];
    var finalResult = [];

    // get current friend list
    if (id) {
        User.findOne({'_id': id}, function (err, user) {
            if (user) {
                // get friend
                if (user.friend) {
                    for (var i = 0; i < user.friend.length; i++) {
                        // push
                        if (user.friend[i].isConfirmed == true)
                            friendIDArray.push(user.friend[i].userId);
                    }
                }
                //get all user info
                User.find({'_id': {$in: friendIDArray}}, function (err, users) {
                    if (users) {
                        //console.log(users);
                        users.forEach(function (user) {
                            var result = {
                                userID: user._id,
                                avatar: user.avatarByProvider,
                                username: user.usernameByProvider,
                                fullName: user.fullName
                            }
                            finalResult.push(result);
                        })
                        res.send({finalResult: finalResult, numberOfFriend: finalResult.length});
                    }
                })

            }
        });
    }
}


/**
 * Nghĩa - get highlight info
 * 19/3/2014
 */
exports.getHighlightList = function (req, res) {
    var userID = req.body.userID;
    var visitor = req.session.passport.user.id;
    console.log('Get highlightList:  ');
    //console.log("uID " + userID);
    //console.log("vID " + visitor);
    var highlightIDArray = [];
    var finalResult = [];

    if (userID && visitor) {
        User.findOne({'_id': userID}, function (err, user) {
            if (user) {
                // get friend
                if (user.highlight) {
                    for (var i = 0; i < user.highlight.length; i++) {
                        // push
                        highlightIDArray.push(user.highlight[i].eventID);
                    }
                }
                //console.log("friendIDArr :" + highlightIDArray);
                // if visitor is creator
                if (visitor == userID) {
                    //console.log("UserID = Visitor");
                    EventDetail.find({'_id': {$in: highlightIDArray}}, function (err, events) {
                        if (events) {
                            events.forEach(function (event) {
                                var result = {
                                    eventID: event._id,
                                    name: event.name,
                                    cover: event.cover,
                                    startTime: event.startTime,
                                    location: event.location
                                }
                                //console.log("result " + JSON.stringify(result));
                                finalResult.push(result);
                            })
                            //console.log("finalresult :" + JSON.stringify(finalResult));
                            res.send({finalResult: finalResult, numberOfHighlight: finalResult.length});
                        }
                    })
                }
                // if visitor is not creator
                else if (visitor != userID) {
                    var findEvent =
                    {'$and': [
                        {'_id': {$in: highlightIDArray}},
                        {'$or': [
                            {'creator.userID': visitor},
                            {
                                $and: [
                                    {'user.userID': visitor},
                                    {'user.status': {$in: ['confirmed']}}
                                ]
                            }
                        ]}
                    ]};
                    EventDetail.find(findEvent, function (err, events) {
                        if (events) {
                            events.forEach(function (event) {
                                var result = {
                                    eventID: event._id,
                                    name: event.name,
                                    cover: event.cover,
                                    startTime: event.startTime,
                                    location: event.location
                                }
                                //console.log("result " + result);
                                finalResult.push(result);
                            })
                            res.send({finalResult: finalResult, numberOfHighlight: finalResult.length});
                        }
                    })
                }
            }
        });
    }
}

exports.convertBadWordListToJson = function (req, res, next) {
    fsx.readFile('bad-word-list.txt', 'utf16le', function (err, rawMenu) {
        if (err)
            console.log("** Read file error: " + err);
        else {
            var data = rawMenu;
            // parse to array
            var desArray = new Array();
            for (var i = 0; i < rawMenu.length; i++) {
                desArray[i] = rawMenu[i];
            }
            // try to treat it as a string
            var dataStr = data.toString();
            // remove head and tail
            dataStr = dataStr.slice(2, dataStr.length - 1);
            // split with character ':'
            dataStr = dataStr.replace(/"/g, "");
            dataStr = dataStr.replace(/(\r\n|\n|\r|\t)/gm, "");
            dataStr = dataStr.split(',');
            var dataInJsonFormat = [];
            for (var i = 0; i < dataStr.length; i++) {
                var tempObject = {};
                var temp = dataStr[i].split(':');
                // get word
                tempObject.word = temp[0];
                // get rate
                tempObject.rate = parseInt(temp[1]);
                // push in desc array
                dataInJsonFormat.push(tempObject);
            }
            // write to file
            var file = './bad-word-list.json';
            fsx.outputJson(file, dataInJsonFormat, function (err) {
                if (err) console.log('** Write file error');
            });

            res.send(JSON.stringify(dataInJsonFormat));
        }
    });
}

/**
 * thuannh
 * get a list of id of event that related to current user
 *
 * @param req
 * @param res
 * @param next
 */
exports.getEventIdsForNoti = function (req, res, next) {
    var currentUser = req.session.passport.user;
    var friend = [];
    var hideList = [];
    if (currentUser) {
        var userID = currentUser.id;
        User.findOne({'_id': userID}, function (err, user) {
                if (!user.hideList) {
                    user.hideList = "";
                }
                for (var i = 0; i < user.friend.length; i++) {
                    friend.push(user.friend[i].userId)
                }
                for (var i = 0; i < user.hideList.length; i++) {
                    hideList.push(user.hideList[i].eventID)
                }
                // Tìm User và USer Friends --> array các ID
                var findFriend = {
                    $and: [
                        {'_id': {$nin: hideList}},
                        // lấy event của mình và của bạn
                        {$or: [
                            //lấy event của mình
                            {
                                $and: [
                                    {'privacy': {$in: ['c', 'o' , 'g']}},
                                    {$or: [
                                        {$and: [
                                            {'user.userID': userID},
                                            {'user.status': {$in: ['confirmed']}}
                                        ]},
                                        {'creator.userID': userID}
                                    ]}
                                ]
                            },
                            // lấy event của bạn
                            {
                                $and: [
                                    {'privacy': {$in: ['c', 'o']}},
                                    {$or: [
                                        {$and: [
                                            {'user.userID': {$in: friend}},
                                            {'user.status': {$in: ['confirmed']}}
                                        ]},
                                        {'creator.userID': {$in: friend}}
                                    ]}
                                ]
                            }
                        ]
                        }
                    ]
                }

                EventDetail.find(findFriend).select('_id').exec(function (err, ids) {
                    if (err) console.log(err);

                    var temp = ids;
                    ids = [];
                    // parse it to used with nin list
                    for (var i = 0; i < temp.length; i++) {
                        ids.push(temp[i]._id);
                    }
                    if (ids.length > 0) {
                        // parse hide list into objectId
                        for (var i = 0; i < ids.length; i++) {
                            var id = '' + ids[i];
                            ids[i] = new ObjectId(id);
                        }
                    }
                    // get event list from timeshelf
                    var findEvent =
                    {'$and': [
                        {'_id': {$nin: ids}},
                        {'$or': [
                            {'creator.userID': userID},
                            {
                                $and: [
                                    {'user.userID': userID},
                                    {'user.status': {$in: ['confirmed']}}
                                ]
                            }
                        ]}
                    ]};
                    EventDetail.find(findEvent).select('_id').exec(function (err, idsTimeshelf) {
                        if (err) return console.log(err);

                        // merge 2 array
                        if (idsTimeshelf.length > 0) {
                            var temp = idsTimeshelf;
                            idsTimeshelf = [];
                            // parse it to used with nin list
                            for (var i = 0; i < temp.length; i++) {
                                idsTimeshelf.push(temp[i]._id);
                            }
                            // then push it to the previous list
                            for (var i = 0; i < idsTimeshelf.length; i++) {
                                ids.push(idsTimeshelf[i]);
                            }
                        }

                        return res.send(200, {ids: ids});
                    });
                });
            }
        );
    }
}

//========================================================================================
// NghiaNV- 16/4/2014
exports.getStatistic = function (req, res, next) {
    var userId = req.body.userID;
    EventDetail.count({ 'creator.userID': userId }, function (err, countCreatedEvents) {
        if (err) console.log('Error !');
        res.send(200, {countCreatedEvents: countCreatedEvents});
    });

}

/**
 * TrungNM - Count Todos
 * Đếm số event đã hoàn thành
 */
// TODO: Code lai Count todos
exports.countTodo = function (req, res, next) {
    var userId = req.body.userId;
    console.log('userController:  countTodo:  ' + JSON.stringify(req.body));
    var todo =
    {'$and': [
        {'_id': userId},
        [{'todoList.status': false}]
    ]};
    User.count(todo, function (err, countTodo) {
        if (err) console.log('Error !')
        console.log('countTodo:   ' + countTodo);
        res.send(200, {countTodo: countTodo});
    });




}

/**
 * thuannh
 * get event to alarm
 *
 * @param req
 * @param res
 * @param next
 * @returns {*|Transport|EventEmitter|boolean|Request|ServerResponse}
 */
exports.getEventToAlarm = function (req,res,next){
    if(!req.session.passport.user) return res.send(200,{error:'No such user'});

    // find event detail that user related
    var query = {$or:[{'creator.userID':req.session.passport.user.id},{'user.$.userID':req.session.passport.user.id}]};
    // -- events that user created
    // -- events that user invited
    EventDetail.find(query,{ '_id': 1, "name": 1,"startTime":1,"endTime":1,"location":1 }).sort({'startTime':-1}).exec(function(err,events){
        if(err) return res.send(200,{error:err});

        if(events.length>0){
            var today = new Date();
            var resultInClientFormat = [];
            for(var i=0;i<events.length;i++){
                var event = events[i];
                // eliminate all event which ended
                var interval = today - event.startTime;
                if(interval < 0){
                    // it has not happened yet
                    var temp = {};
                    temp.name = event.name;
                    temp.id = event._id;
                    temp.startTime = new Date(event.startTime);
                    if(event.endTime) temp.endTime = new Date(event.endTime);
                    temp.location = event.location;
                    temp.isAlarmed = false;
                    // push in client array
                    resultInClientFormat.push(temp);
                }
            }
            // send back to the client
            return res.send(200,resultInClientFormat);
        }else{
            return res.send(200,[]);
        }
    });
}




