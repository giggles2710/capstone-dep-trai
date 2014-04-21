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
var ObjectId = mongoose.Types.ObjectId;
var EventDetail = require("../../models/eventDetail");
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

        if (user) {
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




/**
 * Nghĩa - get all friends info
 * 19/3/2014
 */
exports.getFriendInfo = function (req, res) {
    var id = req.body.userID;
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

// TrungNM: Code for Mobile
exports.getEventIdsForNotiMobile = function (req, res, next) {
    var currentUser = req.body.userId;
    var friend = [];
    var hideList = [];
    if (currentUser) {
        var userID = currentUser;
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
    var month1Like = 0;
    var month2Like =0;
    var month3Like = 0;
    var month1Cmt = 0;
    var month2Cmt =0;
    var month3Cmt = 0;
    var month1Creator= 0;
    var month1Join =0;
    var month2Creator =0;
    var month2Join = 0;
    var month3Creator = 0;
    var month3Join = 0;
    var privateEvent = 0;
    var groupEvent =0;
    var closeEvent=0;
    var openEvent =0;
    User.findOne({ '_id': userId }, function (err, user) {
        if (err) console.log(err);
        if(user){
            // get current Date
            var date = new Date();
            // get current Month of this year
            var firstMonth = new Date(date.getFullYear(),date.getMonth()-2);
            var secondMonth = new Date(date.getFullYear(),date.getMonth()-1);
            var thirdMonth = new Date(date.getFullYear(),date.getMonth());

            if(user.likeNum){
                for(var i =0; i<user.likeNum.length;i++){
                    if(user.likeNum[i].time - firstMonth >0 && secondMonth - user.likeNum[i].time >0){
                        month1Like = month1Like +1;
                    }
                    else if(user.likeNum[i].time - secondMonth >0 && thirdMonth - user.likeNum[i].time >0){
                        month2Like = month2Like +1;
                    }
                    else if(user.likeNum[i].time - thirdMonth > 0){
                        month3Like = month3Like+1;
                    }
                }
            }

            if(user.commentNum){
                for(var i =0; i<user.commentNum.length;i++){
                    if(user.commentNum[i].time - firstMonth >0 && secondMonth - user.commentNum[i].time >0){
                        month1Cmt = month1Cmt + 1;
                    }
                    else if(user.commentNum[i].time - secondMonth >0 && thirdMonth - user.commentNum[i].time >0){
                        month2Cmt = month2Cmt + 1;
                    }
                    else if(user.commentNum[i].time - thirdMonth > 0){
                        month3Cmt = month3Cmt + 1;
                    }
                }
            }
            if(user.eventNum){
                for(var i =0; i<user.eventNum.length;i++){
                    if(user.eventNum[i].eventType == 'c'){
                        closeEvent = closeEvent +1;
                    }
                     else if(user.eventNum[i].eventType == 'g'){
                        groupEvent = groupEvent +1;
                    }
                     else if(user.eventNum[i].eventType == 'p'){
                        privateEvent = privateEvent +1;
                    }
                    else if(user.eventNum[i].eventType == 'o'){
                        openEvent = openEvent +1;
                    }
                }
                for(var i =0; i<user.eventNum.length;i++){
                    if(user.eventNum[i].time - firstMonth >0 && secondMonth - user.eventNum[i].time >0){
                        if(user.eventNum[i].isCreator == true ){
                            month1Creator =month1Creator +1;
                        }
                        else{
                            month1Join = month1Join +1;
                        }

                    }
                    else if(user.eventNum[i].time - secondMonth >0 && thirdMonth - user.eventNum[i].time >0){
//                        if(user.eventNum[i].eventType = 'c'){
//                            closeEvent = closeEvent +1;
//                        }
//                        if(user.eventNum[i].eventType = 'g'){
//                            groupEvent = groupEvent+1;
//                        }
//                        if(user.eventNum[i].eventType = 'p'){
//                            privateEvent =privateEvent+1;
//                        }
//                        if(user.eventNum[i].eventType = 'o'){
//                            openEvent =openEvent + 1;
//                        }
                        if(user.eventNum[i].isCreator == true ){
                            month2Creator = month2Creator + 1;
                        }
                        else{
                            month2Join =month2Join + 1;
                        }

                    }
                    else if(user.eventNum[i].time - thirdMonth > 0){
//                        if(user.eventNum[i].eventType = 'c'){
//                            closeEvent = closeEvent + 1;
//                        }
//                        if(user.eventNum[i].eventType = 'g'){
//                            groupEvent =groupEvent +1;
//                        }
//                        if(user.eventNum[i].eventType = 'p'){
//                            privateEvent =privateEvent + 1;
//                        }
//                        if(user.eventNum[i].eventType = 'o'){
//                            openEvent =openEvent + 1;
//                        }
                        if(user.eventNum[i].isCreator == true ){
                            month3Creator = month3Creator + 1;
                        }
                        else{
                            month3Join = month3Join + 1;
                        }
                    }
                }
            }
        }
        res.send({'month1':firstMonth.getMonth()+1,'month2':secondMonth.getMonth()+1,'month3':thirdMonth.getMonth()+1,
        'month1Like' : month1Like,'month2Like':month2Like,'month3Like':month3Like,
        'month1Cmt':month1Cmt,'month2Cmt':month2Cmt,'month3Cmt':month3Cmt,
        'month1Creator' : month1Creator,'month2Creator' : month2Creator,'month3Creator': month3Creator,
        'month1Join': month1Join,'month2Join': month2Join,'month3Join' : month3Join,
        'privateEvent': privateEvent,'groupEvent': groupEvent, 'openEvent': openEvent, 'closeEvent': closeEvent
        })
    });

}

/**
 * TrungNM - Count Todos
 * Đếm số event đã hoàn thành
 */
// TODO: Code lai Count todos
exports.countTodo = function (req, res, next) {
    var userId = req.body.userId;
    var todo =
    {'$and': [
        {'_id': userId},
        [{'todoList.status': false}]
    ]};
    User.count(todo, function (err, countTodo) {
        if (err) console.log('Error !')
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

/**
 * thuannh
 * recommend friends
 *
 * @param req
 * @param res
 * @param next
 * @returns {*|Transport|EventEmitter|boolean|Request|ServerResponse}
 */
exports.getRecommendedFriends = function(req,res,next){
    if(!req.session.passport.user) return res.send(200, {error: 'no such user'});

    User.findOne({'_id':req.session.passport.user.id},function(err,user){
        if(err) return res.send(200, {error: err});

        if(user.friend && user.friend.length){
            // he has a log of friends
            // 1. get all users who is friend of the current user
            // 1.1. parse user.friend array to ObjectId's array
            helper.parseIdArrayToObjectIdArray(user.friend, 'userId');
            // 1.2. query to get all friends
            User.find({'_id':{'$in':user.friend}},function(err, friends){
                if(err) return res.send(200, {error: err});

                // 2. get all friend
                // 2.1. merge all friend array of the current user's friend
                var allRelatedFriends = [];
                for(var i=0;i<friends.length;i++){
                    allRelatedFriends = allRelatedFriends.concat(friends[i].friend);
                }
                // 2.2. prevent duplicates
                helper.preventDuplicatesInObjectArray(allRelatedFriends,'userId'); // result is the list which contains all people that related to the current user
                // 2.3. parse to the object id array
                helper.parseIdArrayToObjectIdArray(allRelatedFriends,'userId');
                // 3. find the number of mutual friends of the current user
                User.find({'$and':[{'_id':{'$in':allRelatedFriends}},{'_id':{$ne: user._id}},{'_id':{'$nin':user.friend}}]},function(err,friends){
                    if(err) return res.send(200, {error: err});

                    findUserMutualFriend(friends,req.session.passport.user.id,[],function(err,friendsIncludedMutualFriendNumber){
                        if(err) return res.send(200, {error: err});

                        if(friendsIncludedMutualFriendNumber.length > 0){
                            // 4. sort user by job
                            rateUserByCriteria(friendsIncludedMutualFriendNumber,user.occupation,'occupation',1);
                            // 5. sort user by location
                            rateUserByCriteria(friendsIncludedMutualFriendNumber,user.location,'location',2);
                            // 6. sort user by studyplace
                            rateUserByCriteria(friendsIncludedMutualFriendNumber,user.studyPlace,'studyPlace',3);
                            // 7. sort user by workplace
                            rateUserByCriteria(friendsIncludedMutualFriendNumber,user.workplace,'workplace',4);
                            // 8. rate user by mutual friend
                            rateUserByMutualFriend(friendsIncludedMutualFriendNumber);
                            // 9. sort by rate
                            friendsIncludedMutualFriendNumber.sort(sortByRating);
                            // 10. removed who is already friend
                            removeAlreadyFriend(friendsIncludedMutualFriendNumber,user.friend);

                            // return 7 most rating user
                            if(friendsIncludedMutualFriendNumber.length < 7){
                                findRecommedFriendsInAllUser(user,function(err,recommendFriends){
                                    if(err) return res.send(200,{'error':err});

                                    // merge this array with the current array
                                    helper.mergeArrayObjectId(friendsIncludedMutualFriendNumber,recommendFriends);

                                    return res.send(changeUserToClientFormat(friendsIncludedMutualFriendNumber.splice(0,7)));
                                });
                            }else{
                                return res.send(changeUserToClientFormat(friendsIncludedMutualFriendNumber.splice(0,7)));
                            }
                        }else{
                            findRecommedFriendsInAllUser(user,function(err,recommendFriends){
                                if(err) return res.send(200,{'error':err});

                                return res.send(changeUserToClientFormat(recommendFriends.splice(0,7)));
                            });
                        }
                    });
                });
            });
        }else{
           // has has no friend
            findRecommedFriendsInAllUser(user,function(err,recommendFriends){
                if(err) return res.send(200,{'error':err});

                return res.send(changeUserToClientFormat(recommendFriends.splice(0,7)));
            });
        }
    });
}

/**
 * TrungNM
 * Code for Mobile - upload avatar
 *
 * @param req
 * @param res
 * @param next
 * @returns {*|Transport|EventEmitter|boolean|Request|ServerResponse}
 */
exports.uploadAvatarMobile = function(req,res,next){
    fs.writeFile('public/img/avatar/' + req.body.userId + '.png', new Buffer(req.body.photo, "base64"), function(err) {
        if (err){
            console.log('Error! upload Avatar');
            res.send(500);
        }
        res.send(200);
    });
}


/**
 * thuannh
 * find the number of mutual friends for the current user with a list of person
 *
 * @param listUser
 * @param currentUserId
 * @param output
 * @param cb
 * @returns {*}
 */
function findUserMutualFriend(listUser,currentUserId,output,cb){
    if(!output) output = [];

    if(listUser.length == 0) return cb(null,output);

    var userRelated = listUser[0];

    if(userRelated['_id'].equals(ObjectId(currentUserId))){
        // pop out
        listUser.splice(0,1);
        return findUserMutualFriend(listUser,currentUserId,output,cb);
    }

    // find the current user
    User.findOne({'_id':currentUserId},function(err,user){
        if(err) return cb(err,null);

        User.countMutualFriend(user._id,userRelated['_id'],function(err,count){
            if(err) return cb(err,null);

            // assign count in output
            userRelated['mutualFriend'] = count;
            // push in output array
            output.push(userRelated);
            // pop used user out of the input array
            listUser.splice(0,1);
            // call recursive
            return findUserMutualFriend(listUser,currentUserId,output,cb);
        });
    });
}

/**
 * thuannh
 * rate user by criteria
 *
 * @param listUser
 * @param criterionValue
 * @param criteria
 * @param rate
 */
function rateUserByCriteria(listUser, criterionValue, criteria, rate){
//    var differentList = [];
//    var sameList = [];
    if(criterionValue && criterionValue.length > 0){
        for(var i=0;i<listUser.length;i++){
            if(!listUser[i]['rating']) listUser['rating'] = 0;
            if(criterionValue.indexOf(listUser[i][criteria])){
                // move to the sameWorkplace array
//                sameList.push(listUser[i]['rating']);
                // plus rating
                listUser[i]['rating'] = listUser[i]['rating'] + rate;
            }
        }
    }
}

/**
 * thuannh
 * rate user by the number of mutual friends
 *
 * @param listUser
 */
function rateUserByMutualFriend(listUser){
    // sort the same list first
    listUser.sort(sortByMutualFriend);
    // rating
    var minusPoint = 0;
    var oldMututalNumber = listUser[0]['mutualFriend'];
    for(var i=0;i<listUser.length;i++){
        var user = listUser[i];
        if(listUser[i]['mutualFriend'] == oldMututalNumber){
            listUser[i]['rating'] = listUser[i]['rating'] - minusPoint;
        }else{
            ++minusPoint;
            listUser[i]['rating'] = listUser[i]['rating'] - minusPoint;
        }
    }
}

/**
 * thuannh
 * sort by rating
 *
 * @param a
 * @param b
 * @returns {number}
 */
function sortByRating(a,b){
    if(parseInt(a.rating) > parseInt(b.rating)){
        return -1;
    }else if(parseInt(a.rating) > parseInt(b.rating)){
        return 1;
    }else{
        return 0;
    }
}

/**
 * thuannh
 * sort by mutual friend
 *
 * @param a
 * @param b
 * @returns {number}
 */
function sortByMutualFriend(a,b){
    if(parseInt(a.mutualFriend) > parseInt(b.mutualFriend)){
        return -1;
    }else if(parseInt(a.mutualFriend) > parseInt(b.mutualFriend)){
        return 1;
    }else{
        return 0;
    }
}

/**
 * thuannh
 * remove already friends
 *
 * @param listUser
 * @param listFriend
 */
function removeAlreadyFriend(listUser, listFriend){
    for(var i=0;i<listUser.length;i++){
        var user = listUser[i];
        for(var j=0;j<listFriend.length;j++){
            var friend = listFriend[j];

            if(user['_id'].equals(ObjectId(friend._id))){
                listUser[i].splice(i,1);
                break;
            }
        }
    }
}

function findRecommedFriendsInAllUser(user,cb){
    var rand = Math.random();
    User.find({'$and':[
        {'$or':[{'location':user.location},{'workplace':user.workplace},{'studyPlace':user.studyPlace},{'occupation':user.occupation}]},
        {'random':{$lte: rand}},
        {'_id':{$ne: user._id,'$nin':user.friend}}]}).limit(100).exec(function(err,users){
        if(err){
            console.log(err);
            return cb(err,null);
        }

        if(!users || users.length == 0 ){
            User.find({'$and':[
                {'$or':[{'location':user.location},{'workplace':user.workplace},{'studyPlace':user.studyPlace},{'occupation':user.occupation}]},
                {'random':{$gte: rand}},
                {'_id':{$ne: user._id}}]}).limit(100).exec(function(err,users){
                if(err) return cb(err,null);

                // 1. sort user by job
                rateUserByCriteria(users,user.occupation,'occupation',1);
                // 2. sort user by location
                rateUserByCriteria(users,user.location,'location',2);
                // 3. sort user by studyplace
                rateUserByCriteria(users,user.studyPlace,'studyPlace',3);
                // 4. sort user by workplace
                rateUserByCriteria(users,user.workplace,'workplace',4);
                // 5. sort by rate
                users.sort(sortByRating);

                // return 7 most rating user
                return cb(null, users);
            });
        }else{
            // 1. sort user by job
            rateUserByCriteria(users,user.occupation,'occupation',1);
            // 2. sort user by location
            rateUserByCriteria(users,user.location,'location',2);
            // 3. sort user by studyplace
            rateUserByCriteria(users,user.studyPlace,'studyPlace',3);
            // 4. sort user by workplace
            rateUserByCriteria(users,user.workplace,'workplace',4);
            // 5. sort by rate
            users.sort(sortByRating);

            // return 7 most rating user
            return cb(null, users);
        }
    });
}

function changeUserToClientFormat(users){
    var result = [];
    for(var i=0;i<users.length;i++){
        var user = users[i];
        var temp ={};
        temp.id = user._id;
        temp.avatar = user.avatarByProvider;
        temp.username = user.usernameByProvider;
        temp.mutualFriend = user.mutualFriend;
        temp.location = user.location;
        temp.workplace = user.workplace;
        temp.occupation = user.occupation;
        temp.studyPlace = user.studyPlace;

        result.push(temp);
    }
    return result;
}