/**
 * Created by ConMeoMauDen on 02/01/2014.
 */
var path = require('path');
var HOME = path.normalize(__dirname + '/../..');
var User = require(path.join(HOME + "/models/user"));
var helper = require(path.join(HOME + "/helpers/helper"));
//var validator = require(path.join(HOME + "/helpers/groupValidator"));
var fs = require('fs');
var im = require('imagemagick');

module.exports = function (app) {

    // =================================================================================
    // GET: /group - View Group
    app.get('/groups', function (req, res) {
        // Get userID from Session
        if (req.session.user) {
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                if (err) return console.log(err);
                if (user) {
                    console.log(user.group);
                    res.jsonp(user);
                        return res.render('users/groups', {title: 'DCM', user: user});
                }
            });

        } else {
            // Redirect to Profile page
            return res.render('users/profile', {title: 'Profile', user: "", provider: provider});
        }

    });

    // =================================================================================
    // GET: /createGroup - Create new Group
    app.get('/createGroup', function (req, res) {
        res.render('users/createGroup', {title: 'Create New Group'});

    });

    // ============================================================================
    // PUT: /createGroup
    app.put('/createGroup', function (req, res) {
        var userID = req.session.user.id;

        // Nếu đã đăng nhập - có ID trên session
        if (userID) {
            User.update({'_id': userID},
                {
                    $push: {

                    }
                }, function (err, user) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Something Wrong !')
                    }
                }
            )

            return res.send(200, 'OK con de');
        } else
            return res.send(500, 'DCM Khong biet loi o dau');
    });

    // ============================================================================
    // POST: /deleteGroup
    app.post('/deleteGroup', function (req, res) {
        var userID = req.session.user.id;

        // Nếu đã đăng nhập - có ID trên session
        if (userID) {
            User.update({'_id': userID},
                {
                    $pull: {
                        group: {name: req.body.groupName}

                    }
                }, function (err, user) {
                    if (err) {
                        console.log(err);
                        return res.send(500, 'Something Wrong !')
                    }
                }
            )
            res.redirect('groups');
            // return res.render('users/group', {title: 'Group'});
        } else
            return res.send(500, 'DCM Khong biet loi o dau');
    });

    // ============================================================================
    // GET: /groups/:groupID
    // View Group Detail
    app.get('/groups/:id', function (req, res) {
        var groupID = req.params.id;
        User.findOne({'group._id': groupID}, function(err, user){
            if (err) console.log(err);

            res.render('users/groupDetail', {title: 'Group Detail', groupID: groupID, user: user})
        });

    });

    // ============================================================================
    // PUT:    add user to group
    //TODO: coi lại Code
    app.put('/groups/:id', function (req, res) {
        var groupID = req.body.groupid;
        var username = req.body.username;
        // Prepare to DIE !
        var updates = {
            $push: {
                'group.$.listUser': username
            }
        };
        // Update User
        User.update({'group._id': groupID}, updates, function (err) {
            if (err) {
                console.log(err);
                res.send(500, 'Something Wrong !', {groupID: groupID});
            }
        });
        // Update Successful
        res.send(200, 'OK', {groupID: groupID});
    });
}