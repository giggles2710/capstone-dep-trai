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

module.exports = function(app){

    // =================================================================================
    // GET: /group - View Group
    app.get('/group', function (req, res){
        // Get userID from Session
        if (req.session.user){
            User.findOne({'_id': req.session.user.id}, function (err, user) {
                if (err) return console.log(err);
                if (user) {
                    console.log(user.group);
                    console.log(user.group[0].listUser[0].name);
                    return res.render('users/group', {title: 'DCM', user: user});
                }
            });

        } else {
            // Redirect to Profile page
            return res.render('users/profile', {title: 'Profile', user: "", provider: provider});
        }

    });

    // =================================================================================
    // GET: /creategroup - Create new Group
    app.get('/createGroup', function(req, res){
        res.render('users/createGroup', {title: 'Create New Group'});

    });

}