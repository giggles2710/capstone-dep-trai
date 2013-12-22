/**
 * Created by ConMeoMauDen on 22/12/2013.
 */
var express = require('express');
var app = express();

// Express configurations
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views/TrungNM');
    app.set('view engine', 'ejs');
    app.use(app.router);
});

app.get('/', function(req, res) {
    res.render('index', {title: 'Hanoijs', a : 'sida'});
});

app.listen(app.get('port'));