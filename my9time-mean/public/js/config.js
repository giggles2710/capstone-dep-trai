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
                    isPublic: true
                }
            }).
            when('/signin', {
                templateUrl: 'views/users/signin.html',
                title: 'Sign In',
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
//
angular.module('my9time').run(['$rootScope','$location','$http','UserSession', function($root,$location,$http,Session){
    $root.$on('$routeChangeStart',function(event, currRoute, prevRoute){
        // in the first time load page, check session
        // if session is logged, check status of this user
        // return:
        // - if session is none
        // - if user is unavailable, alert
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
                });
        }else{
            if(!prevRoute.strict.isPublic && !Session.isLogged){
                $http({method:'get',url:'/api/checkSession'})
                    .success(function(data, status){
                        // update Session service
                        if(data){
                            Session.userId = data.id;
                            Session.username = data.username;
                            Session.isLogged = true;
                        }else{
                            $location.path('/signin');
                        }
                    })
                    .error(function(data, status){
                        $location.path('/signin');
                    });
            }
        }
    });
}]);