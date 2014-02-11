'use strict';

//Setting up route
angular.module('my9time').config(['$routeProvider','$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider.
            when('/', {
                templateUrl: 'views/index.html',
                title: 'Welcome',
                strict:{
                    isPublic: false
                }
            }).
            when('/signin', {
                templateUrl: 'views/users/signin.html',
                title: 'Sign In',
                strict:{
                    isPublic: true
                },
                stylesheet:
                    [
                        'css/login.css',
                        'css/login-style.css',
                        'css/animate-custom.css'
                    ]
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
            when('/auth/google', {
                strict:{
                    isPublic: true
                }
            }).
            when('/auth/facebook', {
                strict:{
                    isPublic: true
                }
            }).
            when('/recovery',{
                templateUrl: 'views/users/recovery.html',
                strict:{
                    isPublic: true
                }
            }).
            when('/passwordrecover/:token',{
                templateUrl: '/views/users/passwordRecover.html',
                strict:{
                    isPublic: true
                }
            }).
            when('/event/create',{
                templateUrl:'/views/events/create.html',
                strict:{
                    isPublic: true
                },
                controller : 'eventController'
            }).
            when('/event/view',{
                templateUrl:'/views/events/view.html',
//                strict:{
//                    isPublic: true
//                },
                controller : 'eventController'
            }).
            when('/event/edit',{
                templateUrl:'/views/events/edit.html',
//                strict:{
//                    isPublic: true
//                },
                controller : 'eventController'
            }).
            when('/404', {
                templateUrl: 'views/404.html',
                title: '404 - Page Not Found',
                strict:{
                    isPublic: true
                }
            }).
            when('/calendar', {
                templateUrl: 'views/test-calendar.html',
                title: 'Calendar',
                strict:{
                    isPublic: true
                }
            }).
            otherwise({
                redirectTo: '/404'
            });
    }
]);

angular.module('my9time').run(['$rootScope',function($rootScope){
    $rootScope.isLogged = false;
}]);

angular.module('my9time').run(['$rootScope','$location','$http','UserSession', function($root,$location,$http,Session){
    $root.$on('$routeChangeStart',function(event, currRoute, prevRoute){
        // in the first time load page, check session
        // if session is logged, check status of this user
        // return:
        // - if session is none
        // - if user is unavailable, alert
        // load css file
        $root.stylesheets = [];
        if(currRoute.stylesheet){
            angular.forEach(currRoute.stylesheet, function(key, value){
                this.push(key);
            },$root.stylesheets);
        }
        // processing route
        if(!prevRoute){
            // first time load the app, so go check cur session
            $http({method:'get',url:'/api/checkSession/' + 1})
                .success(function(data, status){
                    // update Session service
                    if(data){
                        Session.userId = data.id;
                        Session.username = data.username;
                        Session.isLogged = true;
                    }
                    // check current route
                })
                .error(function(data, status){
                    if(!currRoute.strict.isPublic){
                        $location.path('/signin');
                    }
                });
        }else{
            if(!currRoute.strict.isPublic && !Session.isLogged){
                $location.path('/signin');
            }
        }
    });
}]);