'use strict';

//Setting up route
angular.module('my9time')
    .config(function ($compileProvider){
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
        //TODO: Nghiên cứu cái này dể làm gì
//        $locationProvider.html5Mode(true).hashPrefix('!');
//        $locationProvider.html5Mode(true);
//        $locationProvider.hashPrefix('!');

        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('signin', {
            url: '/signin',
            templateUrl: 'views/signin.html',
            controller: 'userController'
        })
        .state('home', {
            url: '/',
            templateUrl: 'views/homepage/homepage.html',
            controller: 'homeController'
        })
        .state('eventDetail', {
            url: '/events/:eventId',
            templateUrl: 'views/events/view.html',
            controller: 'eventController'
        })
        .state('eventDetail.comments', {
            templateUrl: 'views/events/eventComment.html',
            controller: 'eventController'
        })
        .state('eventDetail.photos', {
            templateUrl: 'views/events/eventPhotos.html',
            controller: 'eventController'
        })
        .state('eventDetail.participants', {
            templateUrl: 'views/events/eventParticipants.html',
            controller: 'eventController'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/users/profile.html',
            controller: 'userController'
        })
        .state('todolist', {
            url: '/todolist',
            templateUrl: 'views/todolist/todolist.html',
            controller: 'todolistController'
        })
        .state('calendar', {
            url: '/calendar',
            templateUrl: 'views/calendar/calendar.html',
            controller: 'calendarController'
        });;
    }]).run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);


// Cài đặt các giá trị mặc định
angular.module('my9time').run(['$rootScope',function($rootScope){
    $rootScope.LOCALHOST = 'http://42.116.222.193:8080';
}]);


// TODO: Code lai doan login luu vao Session
//angular.module('my9time').run(['$rootScope','$location','$http','UserSession', '$rootScope', function($root,$location,$http,Session, $rootScope){
//    $root.$on('$routeChangeStart',function(event, currRoute, prevRoute){
//        // in the first time load page, check session
//        // if session is logged, check status of this user
//        // return:
//        // - if session is none
//        // - if user is unavailable, alert
//        // =============================================================================================================
//        // process layout
//
//        console.log('YOYO');
//        $root.main = false;
//        if(currRoute.layout){
//            if(currRoute.layout == 'main'){
//                $root.main = true;
//            }
//        }
//
//        // =============================================================================================================
//        // processing route
//        // first time load the app, so go check cur session
//        $http({method:'get',url:$rootScope.LOCALHOST + '/api/checkSession/'})
//            .success(function(data, status){
//                console.log('config.js - Server Check Session:   ' + JSON.stringify(data));
//                // update Session service
//                if(data){
//                    Session.userId = data.id;
//                    Session.username = data.username;
//                    Session.isLogged = true;
//                    Session.fullName = data.fullName;
//                    Session.avatar = data.avatar;
//                }
//                // check current route
//            })
//            .error(function(data, status){
//                if(!currRoute.strict.isPublic){
//                    $location.path('/login');
//                }
//            });
//    });
//}]);