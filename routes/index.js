
/*
 * GET home page.
 */
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/Miniti')

// User Schema
var userSchema = ({
    username:  {
        type: String,
        required: true
        //index: {unique: true}
    },
    password:  {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    birthday:{
        type: Date
     //   required: false
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['male','female']
    },
    avatar:String,
    aboutMe: String,
    location: String,
    workplace: String,
    isBanned: Boolean,
    createDate: {
        type: Date,
        default: Date.now
    },
    friend:[{
        username: String,
        fullname: String,
        avatar: String
    }],
    group:{
        name: String,
        listUser: [String]
    },
    todoList:{
        name: String,
        type: String,
        chore: {
            content: String,
            status: String,
            createDate:{
                type: Date,
                default: Date.now
            },
            doneDate: Date
        }
    }
});

//Create User  Model
User = mongoose.model('User', userSchema);

// Index Page
exports.index = function(req, res){
  res.render('index', { title: 'Index bi chuyen cong tac'});
};

// View All
exports.view = function(req, res){
    User.find(function(err, data){
        if(!err) {
            console.log(data);
            res.render('view', { title: 'View All User' , data: data});
        } else {
            console.log('Error');
        }

    })
};

// Delete User
exports.delete = function(req, res){
    var id = req.params.userID;
    console.log(id);
    User.remove({_id: id}, function(err){
        if (!err){
            console.log('Da xoa');
            res.redirect('view');
        } else {
            console.log('Sida');
        }
    })
};


// POST add user
exports.newuser = function(req, res){
    var jsonDate = req.year+"-"+req.month+"-"+req.day
    var birthday = new Date(jsonDate);
//    console.log("Sinh Nhat: "  + birthday);
//    req.setParameter("birthday", birthday)
    var data = req.body;

    if (!req.body._id) {
        var Add = new User(data);
        console.log(data);
        Add.save(function (err) {
            if (err) {
                console.log('Add new have Error!')
            } else {
                console.log('Added !');
                res.redirect('view');
            }
        })
    } else {

        User.findById(req.body._id, function(err,lm){
            lm.save(console.log);
        });
        res.redirect('view');
//        User.update({_id: req.body._id}, data, {upsert: true}, function (err){
//            if (err) {
//                console.log('Update Error !');
//            } else {
//
//                console.log('Modified !');
//                res.redirect('view');
//            }
//        })

    }
};

// Get : Display Add new user page
exports.addnew = function(req, res){
    res.render('addnew', { title: 'Add New User' });
};

// Get : Display Delete user page
exports.del = function(req, res){
    res.render('delete', { title: 'Delete User' });
};