
/*
 * GET home page.
 */
var path = require('path')
    , HOME = path.normalize(__dirname + '/..')
    , User = require(path.join(HOME + '/models/user'))
    , FriendRequest = require(path.join(HOME + "/models/friendRequest"))
    , helper = require(path.join(HOME + "/helpers/helper"));

exports.index = function(req, res){
    return res.render('index', { title: 'Express', user: req.session.user});
};