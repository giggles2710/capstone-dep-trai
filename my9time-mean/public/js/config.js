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
                controller : 'homepageController'
            }).
            when('/event/view/:id',{
                templateUrl:'/views/events/view.html',
                strict:{
                    isPublic: true
                },
                controller : 'homepageController'
            }).
            when('/event/edit/:id',{
                templateUrl:'/views/events/edit.html',
                strict:{
                    isPublic: true
                },
                controller : 'homepageController'
            }).
            when('/homepage',{
                templateUrl:'/views/homepage/homepage.html',
                strict:{
                    isPublic: true
                },
                controller : 'homepageController'
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
            when('/users/viewall', {
                templateUrl: '/views/users/viewall.html',
                title: 'View ALl User',
                strict:{
                    isPublic: true
                },
                controller: 'viewAllUserController'
            }).
            when('/groups', {
                templateUrl: '/views/groups/viewall.html',
                title: 'View ALl Groups',
                strict:{
                    isPublic: true
                },
                controller: 'groupController'
            }).
            when('/groups/create', {
                templateUrl: '/views/groups/create.html',
                title: 'Create group',
                strict:{
                    isPublic: true
                },
                controller: 'groupController'
            }).
            when('/groups/:id', {
                templateUrl: '/views/groups/detail.html',
                title: 'Detail of Group',
                strict:{
                    isPublic: true
                },
                controller: 'groupController'
            }).
            // TrungNM: View User Profile
            when('/profile', {
                templateUrl: '/views/users/profile.html',
                title: 'View User Profile',
                strict:{
                    isPublic: true
                },
                controller: 'userController'
            }).
            // TrungNM: Upload Avatar
            when('/users/avatar', {
                templateUrl: '/views/users/avatar.html',
                title: 'Upload User Avatar',
                strict:{
                    isPublic: true
                },
                controller: 'userController'
            }).
            // TrungNM: Update Profile
            when('/users/edit', {
                templateUrl: '/views/users/edit.html',
                title: 'Update User Profile',
                strict:{
                    isPublic: true
                },
                controller: 'userController'
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