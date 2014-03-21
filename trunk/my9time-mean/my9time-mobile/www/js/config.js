'use strict';

//Setting up route
angular.module('my9time')
    .config(function ($compileProvider){
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
        //TODO: Nghiên cứu cái này dể làm gì
        $locationProvider.html5Mode(true).hashPrefix('!');
//        $locationProvider.html5Mode(true);
//        $locationProvider.hashPrefix('!');

//        $locationProvider.decorator('$sniffer', function($delegate) {
//            $delegate.history = false;
//            return $delegate;
//        });

        $routeProvider.
            when('/', {
//                templateUrl: 'views/test/panel.html',
                templateUrl: 'views/homepage/homepage.html',
                strict:{
                    isPublic: true
                }
            }).
            when('/login', {
                templateUrl: 'views/signin.html',
                controller: 'userController',
                strict:{
                    isPublic: true
                }
            }).
            when('/login', {
                templateUrl: 'views/signin.html',
                controller: 'userController',
                strict:{
                    isPublic: true
                }
            }).
            when('/profile', {
                templateUrl: 'views/users/profile.html',
                controller: 'userController',
                strict:{
                    isPublic: true
                }
            }).
            when('/homepage', {
                templateUrl: 'views/homepage/homepage.html',
                controller: 'homeController',
                strict:{
                    isPublic: true
                }
            }).
            when('/event/view/:id',{
                templateUrl:'views/events/view.html',
                controller: 'eventController',

//                controller: 'userController',
                strict:{
                    isPublic: true
                }
            }).
            when('/event/view/:id/comment',{
                templateUrl:'views/events/eventComment.html',
                controller: 'eventController',
                strict:{
                    isPublic: true
                }
            }).
            when('/todolist',{
                templateUrl:'views/todolist/todolist.html',
                controller: 'userController',
                strict:{
                    isPublic: true
                }
            }).
            when('/404', {
                templateUrl: 'views/404.html',
                strict:{
                    isPublic: true
                }

            }).
            otherwise({
                strict:{
                    isPublic: true
                },
                redirectTo: '/404'
            });
    }]);

angular.module('my9time').run(['$rootScope',function($rootScope){
    $rootScope.isLogged = false;
    $rootScope.LOCALHOST = 'http://42.119.51.198:8080';
}]);

angular.module('my9time').run(['$rootScope','$location','$http','UserSession', '$rootScope', function($root,$location,$http,Session, $rootScope){
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
        $http({method:'get',url:$rootScope.LOCALHOST + '/api/checkSession/'})
            .success(function(data, status){
                console.log('3:   ' + JSON.stringify(data));
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