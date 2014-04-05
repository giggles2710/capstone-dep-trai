'use strict';

//Global service for global variables
angular.module('my9time')
    .factory('UserSession', ['$http',
    function($http) {

        //TODO: sua lai ne
        localStorage.setItem("userId", '533adde18b2322341acf4cb5');
        localStorage.setItem("username", 'admin3');
        localStorage.setItem("isLogged", true);
        localStorage.setItem("fullName", 'Minh Trung');
        localStorage.setItem("isAdmin", false);
        localStorage.setItem("avatar", 'http://192.168.1.3:8080/img/avatar/533adde18b2322341acf4cb5.png');

        var user = {
            userId      : localStorage.getItem("userId"),
            username    : localStorage.getItem("username"),
            fullName    : localStorage.getItem("fullName"),
            avatar      : localStorage.getItem("avatar"),
            isLogged    : localStorage.getItem("isLogged"),
            isAdmin     : localStorage.getItem("isAdmin")
        };

//        var user = {
//            userId      : '',
//            username    : '',
//            fullName    : '',
//            avatar      : '',
//            isLogged    : false,
//            isAdmin     : false
//        };

        return user;
    }
]);
