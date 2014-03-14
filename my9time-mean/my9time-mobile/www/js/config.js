'use strict';

//Setting up route
angular.module('my9time').config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.
            when('/', {
                templateUrl: 'index.html',
                title: 'Welcome',
                strict:{
                    isPublic: false
                }
            }).
            when('/homepage', {
                templateUrl: 'views/homepage/homepage.html',
                title: 'Homepage',
                strict:{
                    isPublic: false
                }
            }).
            when('/timeshelf/:userId', {
                templateUrl: '/views/homepage/timeshelf.html',
                title: 'Timeshelf',
                strict:{
                    isPublic: false
                }
            }).
            when('/login', {
                templateUrl: 'views/users/signin.html',
                title: 'Log In',
                strict:{
                    isPublic: true
                }
            }).
            when('/signup', {
                templateUrl: 'views/users/signup.html',
                title: 'Sign Up',
                strict:{
                    isPublic: true
                }
            }).
            when('/logout', {
                strict:{
                    isPublic: false
                }
            }).
            // TrungNM: View User Profile
            when('/profile', {
                templateUrl: 'index.html',
                title: 'View User Profile',
                strict:{
                    isPublic: true
                }
            }).
            when('/404', {
                templateUrl: 'views/404.html',
                title: '404 - Page Not Found',
                strict:{
                    isPublic: true
                }
            }).
            otherwise({
                redirectTo: '/404'
            });
    }
]);
