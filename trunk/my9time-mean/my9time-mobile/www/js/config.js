'use strict';

//Setting up route
angular.module('my9time').config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
        //TODO: Nghiên cứu cái này dể làm gì
//        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.
            when('/', {
                templateUrl: 'views/signin.html',
                title: 'Homepage',
                controller: 'signinController'
            }).
            when('/login', {
                templateUrl: 'views/signin.html',
                controller: 'signinController'
            }).
            when('/profile', {
                templateUrl: 'views/users/profile.html',
                controller: 'userController'
            }).
            when('/404', {
                templateUrl: 'views/404.html'

            }).
            otherwise({
                redirectTo: '/404'
            });
    }
]);
