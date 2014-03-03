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
                controller : 'createEventController'
            }).
            when('/event/view/:id',{
                templateUrl:'/views/events/view.html',
                strict:{
                    isPublic: true
                },
                controller : 'viewEventController'
            }).
            //TrungNM
            when('/event/view/:id/comment',{
                templateUrl:'/views/component/comment.html',
                strict:{
                    isPublic: true
                },
                controller : 'commentController'
            }).
            when('/event/edit',{
                templateUrl:'/views/events/edit.html',
                strict:{
                    isPublic: true
                },
                controller : 'viewEventController'
            }).
            when('/event/uploadImage',{
                templateUrl:'/views/events/uploadImage.html',
                strict:{
                    isPublic: true
                },
                controller : 'viewEventController'
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
                },
                controller:'CalendarController'
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
                }
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
            // TrungNM: Update Profile
            when('/avatarcrop', {
                templateUrl: '/views/component/testCrop1.html',
                title: 'Update User Profile',
                strict:{
                    isPublic: true
                },
                controller: 'createEventController'
            }).
            when('/messages', {
                templateUrl: '/views/messages/all.html',
                title: 'Inbox',
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
        // =============================================================================================================
        // process layout
        $root.main = false;
        if(currRoute.layout){
            if(currRoute.layout == 'main'){
                $root.main = true;
            }
        }
        // =============================================================================================================
        // processing route
        // first time load the app, so go check cur session
        $http({method:'get',url:'/api/checkSession/'})
            .success(function(data, status){
                // update Session service
                if(data){
                    Session.userId = data.id;
                    Session.username = data.username;
                    Session.isLogged = true;
                    Session.fullName = data.fullName;
                    Session.avatar = data.avatar;
                }
                // check current route
            })
            .error(function(data, status){
                if(!currRoute.strict.isPublic){
                    $location.path('/login');
                }
            });
    });
}]);