/**
 * Created by Noir on 12/24/13.
 */

// strategy
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy =require('passport-google-oauth').OAuth2Strategy;

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
        User.findOne({'facebook.id':id}, function(err, user){
            done(err, user);
        });
    });

    // ================================================================================
    // FACEBOOK LOGIN =================================================================
    passport.use(new FacebookStrategy({
        clientID    : configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL : configAuth.facebookAuth.callbackURL
    },
        // facebook will send back the token and profile
        function(req, token, refreshToken, profile, done){
            // asynchronous
            process.nextTick(function(){
                User.findOne({$or:[
                    {'facebook.email':profile.emails[0].value},
                    {'email':profile.emails[0].value}]
                },function(err,user){
                    if(err) return done(err);

                    if(user){
                        // if user is found
                        if(!user.facebook.id){
                            // if this is the first time
                            // update facebook profile
                            user.facebook.id = profile.id;
                            user.facebook.token = token; // token key that facebook provides
                            user.facebook.displayName = profile.displayName;
                            user.facebook.profileUrl = profile.profileUrl;
                            user.facebook.avatar = "https://graph.facebook.com/"+profile.username+"/picture";
                            user.facebook.email = profile.emails[0].value;

                            user.save(function(err){
                                if(err) return done(err);

                                return done(null, user);
                            });
                        }else{
                            // return that user
                            return done(null, user);
                        }
                    }else{
                        var newUser = new User();
                        // facebook
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token; // token key that facebook provides
                        newUser.facebook.displayName = profile.displayName;
                        newUser.facebook.profileUrl = profile.profileUrl;
                        newUser.facebook.avatar = "https://graph.facebook.com/"+profile.username+"/picture";
                        newUser.facebook.email = profile.emails[0].value;
                        // personal
                        newUser.firstName = profile.name.givenName;
                        newUser.lastName = profile.name.familyName;
                        newUser.gender = profile._json.gender;
                        newUser.location = profile._json.hometown.name;

                        newUser.save(function(err){
                            if(err) return done(err);

                            return done(null, newUser);
                        });
                }
                }); // end callback
            }); // end callback of nextTick
        }
    )); // end facebook login

    // ================================================================================
    // GOOGLE LOGIN ===================================================================
    passport.use(new GoogleStrategy({
        clientID            :       configAuth.googleAuth.clientID,
        clientSecret        :       configAuth.googleAuth.clientSecret,
        callbackURL         :       configAuth.googleAuth.callbackURL,
        scope               :       configAuth.googleAuth.scope
    },function(accessToken, refreshToken, profile, done){
        User.findOne({$or:[
            {'google.email':profile.emails[0].value},
            {'email':profile.emails[0].value}]
        },function(err, user){
            if(err) return done(err);

            if(user){
                // if a user is found, log them in
                if(!user.google.id){
                    // if this is the first time
                    // update their google profile
                    user.google.id = profile._json.id;
                    user.google.refreshToken = refreshToken;
                    user.google.accessToken = accessToken;
                    user.google.displayName = profile.displayName;
                    user.google.profileUrl = profile._json.link;
                    user.google.avatar = profile._json.picture;
                    user.google.email = profile._json.email;

                    user.save(function(err){
                        if(err) return done(err);

                        return done(null, user);
                    });
                }else{
                    // else return user
                    return done(null, user);
                }
            }else{
                // create new user
                var newUser = new User({
                    firstName: profile.name.familyName,
                    lastName: profile.name.givenName,
                    gender: profile._json.gender,
                    provider: profile.provider
                });

                newUser.google.id = profile._json.id;
                newUser.google.refreshToken = refreshToken;
                newUser.google.accessToken = accessToken;
                newUser.google.displayName = profile.displayName;
                newUser.google.profileUrl = profile._json.link;
                newUser.google.avatar = profile._json.picture;
                newUser.google.email = profile._json.email;

                newUser.save(function(err){
                    if(err) return done(err);

                    return done(null, newUser);
                });
            }
        }); // end GOOGLE login
    }))

}

