'use strict';

//Global service for global variables
angular.module('my9time.system')
    .factory('UserSession', ['$http',
    function($http) {
        var user = {
            userId      : '',
            username    : '',
            isLogged    : false
        };

        return user;
    }
]);
