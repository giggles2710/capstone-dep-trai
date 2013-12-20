/**
 * Created by ConMeoMauDen on 15/12/2013.
 */
// Mongoose initialize:
var mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/test')


var userSchema = {
    username:    {
        type: String,
        required: true
    },
    password:  {
        type: String,
        required: true
    },
    email:     {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    birthday:   {
        type: Date,
        required: false
    },
    gender:   {
        type: String,
        required: true
    },
    avatar: String,
    aboutme: String,
    location: String,
    workplace: String,
    banned: Boolean,
    createddate: Date,
    friend: [{
        username: String,
        fullname: String,
        avatar: String
    }],
    group: {
        name: String,
        listuser: [String]
    },
    todolist:{
        name: String,
        type: String,
        chore:{
            content: String,
            status: String,
            createddate: Date,
            donedate: Date
        }
    }

}
User = mongoose.model('User', userSchema);

// Model instances:
var User = new User({
    username:'SE80088',
    password:'123456789',
    email: 'trung@yahoo.com',
    fullname:'Nguyen Minh Trung',
    gender:'Male',
    location:'Da Nang',
    friend: [{
        username: 'SE90090',
        fullname:'Tran Nhat Minh'
    }, {
        username: 'SE90089',
        fullname:'Dinh Minh Chau'
    }],
    group:  {
    name:'FUD',
    listuser: ['SE90012','SE90013','SE90015']
    }
});

//Save to Database
User.save(function(err){
    if (err){
        console.log('Error !');
    } else {
        console.log('Saved');
    }

    }
)

