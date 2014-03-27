'use strict';

//Global service for global variables
angular.module('my9time.system')
    .factory('UserSession', ['$http',
    function($http) {
        var user = {
            userId      : '',
            username    : '',
            fullName    : '',
            avatar      : '',
            isLogged    :   false,
            isAdmin     :   false
        };

        return user;
    }
]);
