/**
 * Created by Noir on 12/24/13.
 */

// strategy
var FacebookStrategy = require('passport-facebook').Strategy;

// model
var User = require('../models/user');

// auth variables
var configAuth =require('./auth');

module.exports = function(passport){
    // passport session setup
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findOne({'id':id}, function(err, user){
            done(err, user);
        });
    });

    // FACEBOOK LOGIN
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done){
            // asynchronous
            process.nextTick(function(){
                User.findOne({
                    'facebook.id':profile.id
                },function(err,user){
                    console.log('im');
                    if(err) return done(err);
                    console.log('imf');
                    if(user){
                        return done(null, user);
                    }else{

                        var newUser = new User();
                        // facebook
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token; // token key that facebook provides
                        newUser.facebook.displayName = profile.displayName;
                        newUser.facebook.profileUrl = profile.profileUrl;
                        // personal
                        newUser.email = profile.emails[0].value;
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;
                        newUser.birthday
                        newUser.gender = profile._json.gender;
                        newUser.location = profile._json.hometown.name;
                        newUser.avatar = "https://graph.facebook.com/"+profile.username+"/picture";

                        newUser.save(function(err){
                            if(err) return done(null, );

                            return done(null, newUser);
                        });
                }
                }); // end callback
            }); // end callback of nextTick
        }
    ));
}

