
/*
 * GET home page.
 */

exports.index = function(req, res){
    return res.render('index', { title: 'Express', user: req.session.user});
};

exports.allTest = function(req, res){
    var onlinerId = '';
    var ownerId = req.params.id;

    if(req.session.user){
        onlinerId = req.session.user.id;
    }

    return res.render('notification/all',{title: 'Test notification', ownerId: ownerId, onlinerId: onlinerId});
}