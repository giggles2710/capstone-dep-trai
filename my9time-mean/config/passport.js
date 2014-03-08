'use strict';

var LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = require('../app/models/user'),
    config = require('./config');


module.exports = function(passport) {
    // passport session setup
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function(user, done){
        done(null, {id: user.id, username: user.usernameByProvider, fullName: user.avatarByProvider});
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id.id
        },function(err, user) {
            done(err, user);
        });
    });

    // Use local strategy
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({
                'local.username': username
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message:'The username or password you entered is incorrect'});
                }
                User.authenticate(username, password, function(err, user, reason){
                    if(err)
                        return done(err);

                    if(user){
                        // login success
                        return done(null, user);
                    }

                    // otherwise we can determine why we failed
                    var reasons = User.failedLogin;

                    if(reason == reasons.INPUT_REQUIRED){
                        return done(null, false, {message:'Enter your username/password'});
                    }else if(reason==reasons.MAX_ATTEMPTS){
                        return done(null, false, {message:'Your account is locked. Please try again after 2 hours'});
                    }else{
                        return done(null, false, {message:'The username or password you entered is incorrect'});
                    }

                    return done(null, user);
                });
            });
        }
    ));

    // ================================================================================
    // FACEBOOK LOGIN =================================================================
    passport.use(new FacebookStrategy({
            clientID    : config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL : config.facebook.callbackURL
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
        clientID            :       config.google.clientID,
        clientSecret        :       config.google.clientSecret,
        callbackURL         :       config.google.callbackURL,
        scope               :       config.google.scope
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
    }));
};