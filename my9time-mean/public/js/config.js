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
            when('/404', {
                templateUrl: 'views/404.html',
                title: '404 - Page Not Found'
            }).
            otherwise({
                redirectTo: '/404'
            });
    }
]);