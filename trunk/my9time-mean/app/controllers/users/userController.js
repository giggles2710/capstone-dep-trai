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
var EventDetail = require("../../models/eventDetail")
var mongoose = require('mongoose');

/**
 * ===============================================================================
 * Update Languages
 * NghiaNV - 5/3/2014
 */
exports.changeLanguage = function(req, res){
    User.findOne({'_id':req.session.passport.user.id}, function(err, user){
        user.language = req.body.language;
        console.log("req.body.language :" +req.body.language);
        user.save(function (err, user) {
            if (err){
                var errorMessage = helper.displayMongooseError(err);
                return res.send(500, errorMessage);
            }
            console.log("user.language : "+user.language)
        });

    });
}
exports.getLanguage = function(req, res){
    User.findOne({'_id':req.session.passport.user.id}, function(err, user){
        res.send(200,{'language' : user.language});

    });
}



//Khu vuc cua Minh o duoi
exports.addTodo = function(req, res){
    var content = req.body.content;
    var idTodo = mongoose.Types.ObjectId();
    var updates = {
        $push: {todoList:
        {
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
exports.removeTodo = function(req,res){
    console.log(JSON.stringify(req.body.todo));
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
        }  )
};

exports.changeStatusTodo = function(req, res){
    var updates = '';
    if (req.body.todo.status == true){
        updates = {
            $set: {'todoList.$.status': false}
        };

    } else {
        updates = {
            $set: {'todoList.$.status': true}
        };
    }

    User.update({'todoList._id': req.body.todo._id},updates, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something Wrong !')
        }

//        res.send(200, {statusTodo: });
        console.log("2222");
        console.log(user);
    }  )
    if (req.body.todo.status == true){
        res.send(200, {statusTodo: "false"});
    } else {
        res.send(200, {statusTodo: "true"});
    }};




exports.checkRecoveryToken = function(req, res, next){
    // check token is valid
    var token = req.params.token;
    var title = 'Reset password';
    UserToken.findOne({'token':token},function(err, userToken){
        if(err){
            console.log(err);
            return next();
        }

        // found this token
        if(userToken){
            // check if this userToken is expires or not
            if(userToken.expires < Date.now())
                return res.send(400, 'Your request is expired');
            // this still is available
            // reset password and render page to user input new password
            return res.send(200, {userId:userToken.userId});
        }else{
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
exports.checkRecoveryEmail = function(req, res, next){
    // check this email if it's belong to this user
    // mongodb query: db.users.find({email:1.99, $or: [ { qty: { $lt: 20 } }, { sale: true } ] } )
    User.findOne({'local.username':req.params.username,'email':req.params.email}, function(err, user){
        if(err)
            return console.log(err);

        console.log('im here 1 ' + JSON.stringify(user));
        if(user){
            console.log('im here 2');
            // user is match
            // create a token
            var userToken = new UserToken({
                userId:user._id,
                token: ''
            });

            userToken.save(function(err, userToken){
                if(err) return res.send(500, err);
                var resetUrl = 'http://localhost:8080/passwordrecover/' + userToken.token + '';
                // send a mail to their email and render success page
                mailHelper.sendResetPasswordMail(user.email, resetUrl, userToken.createDate, function(err, responseStatus, http, text){
                    if(err) return console.log(err);

                    return res.send(200, 'Message send successfully');
                });
            });
        }else{
            console.log('im here 3');
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
exports.checkSession = function(req, res, next){
    var isFirstTime = req.params.isFirstTime;
    if(req.session.passport.user){
        // is authenticated
        // then check user is available or not
        if(!isFirstTime){
            // check user is available or not
            User.findOne({'_id':req.session.passport.user.id},function(err, user){
                if(err){
                    return next();
                }

                if(user){
                    if(user.isLocked){
                        // user is locked
                        req.logout();
                        return res.send(400);
                    }else{
                        return res.send(200, {id:req.session.passport.user.id, username: req.session.passport.user.username});
                    }
                }else{
                    req.logout();
                    return res.send(400);
                }
            })
        }else{
            return res.send(200, {id:req.session.passport.user.id, username: req.session.passport.user.username});
        }
    }else{
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
exports.updateUser = function(req, res, next){
    console.log('im here 1');
    console.log('params ' + JSON.stringify(req.params));
    console.log('body ' + JSON.stringify(req.body));
}
/**
 * check unique for username and email
 *
 * @param req
 * @param res
 * @param next
 */
exports.checkUnique = function(req, res, next){
    var str = req.body.target;
    var type = req.body.type;
    str.toLowerCase();
    var query = (type=='username')?{'local.username':str}:{'email':str};

    console.log('target: ' + str +' type: '+type+' query: '+JSON.stringify(query));
    User.count(query , function(err, n){
        if(err) return console.log(err);

        if(n<1){
            // doesn't exist
            return res.send(200, true);
        }else{
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
exports.logout = function(req, res, next){
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
exports.signup = function(req, res, next) {
    console.log(':::' + JSON.stringify(req.body));

    User.findOne({$or:[
        {'facebook.email':req.body.email},
        {'email':req.body.email}]
    },function(err, user){
        if(err) return res.send(500, "Something wrong happened. Please try again.");


        if(user){
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
                if (err){
                    var errorMessage = helper.displayMongooseError(err);
                    return res.send(500, errorMessage);
                }

                req.logIn(user, function(err){
                    if(err) return next(err);
                    return res.redirect('/'); // created -> login -> redirect to this page
                });
            });
        }else{
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
                if (err){
                    var errorMessage = helper.displayMongooseError(err);
                    return res.send(500, errorMessage);
                }

                req.logIn(user, function(err){
                    if(err) return next(err);
                    return res.redirect('/'); // created -> login -> redirect to this page
                });
            });
        }
    });
};

exports.updateUser = function(req, res, next){
    console.log(JSON.stringify(req.params));
    return next();
}

exports.findOneUser = function(req, res, next){
    User.findOne({'_id':req.params.id}, function(err, user){
        if(err){
            console.log('**' + err);
            return next();
        }

        return res.send(user);
    });
}

exports.initUser = function(req, res, next){
    fsx.readFile('db.json','utf-8',function(err, rawMenu){
        if(err)
            console.log("** Read file error: " + err);
        else{
            var data = JSON.parse(rawMenu);
            for(var i=0;i<data.length;i++){
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
                    email:data[i].email
                }).save(function(err){
                        if(err){
                            console.log("** " + err);
                            res.send('ERR');
                        }
                    });
            }
            console.log('Init done...');
            User.find(function(err, users){
                if(!err)
                    res.send(users);
            });
        }
    });
}

exports.destroyUser = function(req, res, next){
    User.remove({},function(err){
        if(err) return console.log(err);

        return res.redirect('/');
    });
}



/**
 * TrungNM - View Profile of User
 * URL: 'api/profile'
 */
exports.viewProfile = function(req, res, next){
    console.log(JSON.stringify(req.body));
    User.findOne({'_id':req.params.id}, function(err, user){
        // Nếu có lỗi
        if(err){
            return next();
        }
        // Nếu thành công
        return res.send(user);
    });
}

exports.phoneLogin = function(req, res, next){
    console.log(JSON.stringify(req.body));
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
//                // TODO: Coi lai code Rdrect PUT --> GET
//                return res.redirect('profile');
//            });
//        });
//
//    });
//}
exports.editProfile = function(req, res){
    User.findOne({'_id':req.body.userID}, function(err, user){
        if(user){
            user.location = req.body.location;
            user.occupation = req.body.occupation;
            user.workplace = req.body.workplace;
            user.studyPlace = req.body.studyPlace;
            user.aboutMe = req.body.aboutMe;
            if(!user.showBirthday){
                user.showBirthday='y';
            }
            if(req.body.showBirthday != '' && !req.body.birthday){
            user.showBirthday = req.body.showBirthday;
            }
            user.save(function (err, user) {
                if(user){
                    res.send(user);
                }
                else{
                    var errorMessage = helper.displayMongooseError(err);
                    return res.send(500, errorMessage);
                }
            });
        }
        else res.send(500,'Error');


    });
}

/**
 * TrungNM - Delete User
 * URL: 'api/users/delete/:id'
 */
exports.deleteUser = function(req, res, next){
    var id = req.params.userID;
    console.log('Delete user:  ' + id);
    User.remove({'_id' : id}, function(err, user){
        // Nếu có lỗi
        if(err){
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

exports.cropAvatar = function(req, res, next){
    var selected = req.body.selected;
    var userID = req.session.passport.user.id;
    console.log('Crop avatar');

    easyimg.crop(
        {
            src:'./public/img/avatar/' + userID + '.png', dst:'./public/img/avatar/'+ userID +'.png',
            cropwidth:selected.w, cropheight:selected.h,
            gravity:'NorthWest',
            x:selected.x, y:selected.y
        },
        function(err, image) {
            if (err) throw err;
        }
    );
    res.send(200);


}

exports.uploadAvatar = function(req, res, next){
    var file = req.files.file;
    var userID = req.session.passport.user.id;
    console.log(file.path);

    fsx.copy(file.path, 'public/img/avatar/'+ userID + '.png' , function (err) {
        // Nếu có lỗi, thông báo
        if (err) {
            console.log('Error:  ' + err);
        }
        fs.unlink(file.path, function(err){
            if (err) console.log(err);

        })
        res.send(200);
    });




}

// TODO: Kiểm tra lại Upload nhiều file, phân chia lưu file như thế nào ?
exports.multipleFileUpload = function(req, res){
    var file = req.files.file;
    var userID = req.session.passport.user.id;
    var eventID = req.body.eventID;
    // Tạo ra 1 id cho ảnh
    var idImage = mongoose.Types.ObjectId();

    fsx.copy(file.path, 'public/img/events/'+ userID + '_' + eventID + '_' + idImage +'.png' , function (err) {
        if (err) {
            console.log('Error:  ' + err);
        }

        // Nếu xử lí file thành công
        // Chuẩn bị Query để thêm comment vào event
        var updates = {
            $push: {
                'photo':'/img/events/'+ userID + '_' + eventID + '_' + idImage+'.png'
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
exports.phoneUser = function(req, res){
    User.findOne({'_id':'52f9d20adc2149801a21bbc7'}, function(err, user){
        // Nếu có lỗi
        if(err){
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
exports.getFriendInfo = function(req, res){
    var id = req.body.userID;
    var friendList = [];
    console.log('Get friend info:  ');
    console.log("ID " + id);
    // get current friend list
    User.findOne({'_id' : id}, function(err, user){
        if(user){
            console.log("User:" + user);
            if(!user.friend){
                user.friend = "";
            }
            user.friend.forEach(function(buddy){
                console.log("For Each");
                console.log("Friend:" + buddy);
                User.findOne({'_id':buddy.userId},function(err,friend){
                    if(err){
                        console.log("Err" + err)
                    }
                    if(friend){
                        var username = friend.usernameByProvider;
                        var avatar = friend.avatarByProvider;
                        var fullName = friend.fullName;
                        console.log("userName" + username);
                        console.log("Avatar" + avatar);
                        console.log("fullName" + fullName);
                        var friendInfo = {
                            userID : friend._id,
                            avatar : avatar,
                            username:username,
                            fullName: fullName,
                            addedDate: friend.addedDate
                        }
                        console.log("Friend: "+ JSON.stringify(friendInfo))
                        friendList.push(friendInfo);
                        console.log("FriendList: "+ JSON.stringify(friendList))

                    }
                    else console.log("No such event")
                })
            })
            res.send(friendList)
        }
        if(err){
            res.send(500,err)
        }
        else res.send(500,'No such User')
    });
}


