/**
 * Created by Noir on 12/24/13.
 */

module.exports = {
    'facebookAuth' : {
        'clientID'      :   '605820476120481',
        'clientSecret'  :   '969fe49040272da5b35a50953596b48a',
        'callbackURL'   :   'http://localhost:8080/auth/facebook/callback'
    },
    'googleAuth':{
        'clientID'      :   '1036313509787-6r4301ntkpntau475ls88a8md6jr6ust.apps.googleusercontent.com',
        'clientSecret'  :   'X6wYCLfKMF8r-nPc6R96cyYX',
        'callbackURL'   :   'http://localhost:8080/auth/google/callback',
        'scope'         :   'https://www.google.com/m8/feeds ' +
            'https://www.googleapis.com/auth/userinfo.email ' +
            'https://www.googleapis.com/auth/userinfo.profile'
    }
}