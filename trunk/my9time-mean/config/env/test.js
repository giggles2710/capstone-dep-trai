'use strict';

module.exports = {
    db: "mongodb://localhost/my9time-test",
    port: 8088,
    app: {
        name: "My9Time - An Event Network - Test"
    },
    facebook: {
        clientID        :   "277330779085010",
        clientSecret    :   "6ccd75debea0453a73859b6f2ec38ac5",
        callbackURL     :   "http://localhost:3000/auth/facebook/callback"
    },
    google: {
        clientID        :   "721876835942-em2nnu8cs4g30nh0s7f2i62iaoep1dml.apps.googleusercontent.com",
        clientSecret    :   "0XIYvp2VtG7i1jOzcb1Xswf7",
        callbackURL     :   "http://localhost:3000/auth/google/callback",
        scope           :   "https://www.google.com/m8/feeds " +
            "https://www.googleapis.com/auth/userinfo.email " +
            "https://www.googleapis.com/auth/userinfo.profile"
    }
}