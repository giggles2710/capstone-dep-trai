
/*
 * GET home page.
 */

exports.index = function(req, res){
    return res.render('index', { title: 'Express' });
};

exports.loginTest = function(req, res){
    var title = 'Express';
    var isLoggedIn = false;
    if(req.session.user){
        title = req.session.user.fullName + " of " + req.session.user.provider;
        isLoggedIn = true;
    }
    return res.render('indexLoginTest', { title: title , isLoggedIn: isLoggedIn});
};