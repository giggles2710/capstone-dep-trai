'use strict';

module.exports = {
    db: "mongodb://localhost/my9time-dev",
    app: {
        name: "My9Time - A Social Event Network"
    },
    facebook: {
        clientID        :   "721275637897016",
        clientSecret    :   "6c213d352e14efe9a20c48963e379add",
        callbackURL     :   "http://localhost:8080/auth/facebook/callback"
    },
    google: {
        clientID        :   "683765542291-qtdchq5p7f551njnrqs6s6c9uoe9bnjp.apps.googleusercontent.com",
        clientSecret    :   "sa2CG3vaTHtEYTs3UgZu8U3c",
        callbackURL     :   "http://localhost:8080/auth/google/callback",
        scope           :   "https://www.google.com/m8/feeds " +
            "https://www.googleapis.com/auth/userinfo.email " +
            "https://www.googleapis.com/auth/userinfo.profile"
    }
}