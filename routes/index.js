
/*
 * GET home page.
 */

exports.index = function(req, res){
    var title = 'Express';
    var isLoggedIn = false;
    if(req.session.user){
        title = req.session.user.fullName + " of " + req.session.user.provider;
        isLoggedIn = true;
    }
    return res.render('index', { title: title , isLoggedIn: isLoggedIn});
};