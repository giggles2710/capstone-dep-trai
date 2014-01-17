'use strict';

//Setting up route
angular.module('my9time').config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.
            when('/', {
                templateUrl: 'views/index.html',
                title: 'Welcome'
            }).
            when('/signin', {
                templateUrl: 'views/users/signin.html',
                title: 'Sign In'
            }).
            when('/signup', {
                templateUrl: 'views/users/signup.html',
                title: 'Sign Up'
            }).
            when('/logout', { }).
            otherwise({
                redirectTo: '/'
            });
    }
]);

//Setting HTML5 Location Mode
//angular.module('my9time').config(['$locationProvider',
//    function($locationProvider) {
//        $locationProvider.html5Mode(true);
////        $locationProvider.hashPrefix('!');
//    }
//]);