/**
 * Created by Noir on 1/2/14.
 */

module.exports = function(app){
    app.io.route('ready',function(req){
        req.io.join(req.data);
        console.log('joined room ' + req.data);
    });
}
