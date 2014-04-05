/**
 * Created by ConMeoMauDen on 19/03/2014.
 */
angular.module('my9time.homepage').controller('homeController', ['$rootScope', '$scope', '$location', '$http','Helper', 'UserSession', '$state', '$stateParams', '$window', 'Event', '$modal', function ($rootScope, $scope, $location, $http, Helper, Session, $state, $stateParams, $window, Event, $modal) {

    $scope.global = Session;
    $scope.isLogged = localStorage.getItem("isLogged");
    if (!$scope.isLogged){
        $scope.isLogged = false
    }
    $scope.events = [];
    $scope.friends = [];
    $scope.posts = [];
    $scope.userId = $scope.global.userId;
    $scope.ownerId = $stateParams.userId;

    // Đăng xuất
    $scope.logout = function(){
        $http({
            method: 'GET',
            url: $rootScope.LOCALHOST + '/logout'
        })
            .success(function(data, status){
                // success, clear service session
                localStorage.setItem("userId", '');
                localStorage.setItem("username", '');
                localStorage.setItem("isLogged", false);
                localStorage.setItem("fullName", '');
                localStorage.setItem("isAdmin", false);
                localStorage.setItem("avatar", '');
                $window.location.href = '/';
            });
    }

    // Khởi tạo page
    $scope.initPage = function(){
        $( document ).on( "pagecreate", function() {
            $( "body > [data-role='panel']" ).panel();
            $( "body > [data-role='panel'] [data-role='listview']" ).listview();
        });
        $( document ).one( "pageshow", function() {
            $( "body > [data-role='header']" ).toolbar();
            $( "body > [data-role='header'] [data-role='navbar']" ).navbar();
        });
    }

    // Lấy tất cả các Event - homepage
    $scope.initHomepage = function(){
        Event.getEventHomepage({},{userId: $scope.userId}, function(res){
            $scope.events = res.events;
        })

    }

    // Đi đến 1 event
    $scope.goToEvent = function(eventId){
        console.log('homeController - goToEvent:   ' + eventId);
        $state.go('eventDetail', {'eventId': eventId } )
    }

    $scope.gotoTodo = function(){
        $state.go('todolist');
    }


//    $scope.initNotification = function(){
//        // Created by Nam
//        // Notifications
//        // =================================================================================================================
//        $(".noti a").mousedown(function () {
//            var mrgtb = parseInt($(this).css("margin-top"));
//            var mrglf = parseInt($(this).css("margin-left"));
//            mrgtb = mrgtb + 2;
//            mrglf = mrglf + 0;
//            $(this).css("margin-top", mrgtb + "px").css("margin-left", mrglf + "px");
//        }).mouseup(function () {
//                var mrgtb = parseInt($(this).css("margin-top"));
//                var mrglf = parseInt($(this).css("margin-left"));
//                mrgtb = mrgtb - 2;
//                mrglf = mrglf - 0;
//                $(this).css("margin-top", mrgtb + "px").css("margin-left", mrglf + "px");
//            });
//
//        $(".event-request-icon").click(function () {
//            var X = $(this).attr('id');
//            if (X == 1) {
//                $(".event-request-item").hide();
//                $(this).attr('id', '0');
//            }
//            else {
//                $(".event-request-item").show();
//                $(this).attr('id', '1');
//            }
//
//            $(".notification-item, .message-item, .friend-request-item").hide();
//            $(".noti-icon,.message-icon,.friend-request-icon").attr('id', '');
//        });
//
//        $(".friend-request-icon").click(function () {
//            var X = $(this).attr('id');
//            if (X == 1) {
//                $(".friend-request-item").hide();
//                $(this).attr('id', '0');
//            }
//            else {
//                $(".friend-request-item").show();
//                $(this).attr('id', '1');
//            }
//
//            $(".notification-item, .event-request-item, .message-item").hide();
//            $(".noti-icon,.event-request-icon,.message-icon").attr('id', '');
//        });
//
//        $(".message-icon").click(function () {
//            var X = $(this).attr('id');
//            if (X == 1) {
//                $(".message-item").hide();
//                $(this).attr('id', '0');
//            }
//            else {
//                $(".message-item").show();
//                $(this).attr('id', '1');
//            }
//
//            $(".notification-item, .event-request-item,.friend-request-item").hide();
//            $(".noti-icon,.event-request-icon,.friend-request-icon").attr('id', '');
//        });
//
//        $(".noti-icon").click(function () {
//            var X = $(this).attr('id');
//            if (X == 1) {
//                $(".notification-item").hide();
//                $(this).attr('id', '0');
//            }
//            else {
//                $(".notification-item").show();
//                $(this).attr('id', '1');
//            }
//
//            $(".event-request-item, .message-item, .friend-request-item").hide();
//            $(".event-request-icon,.message-icon,.friend-request-icon").attr('id', '');
//        });
//
//        //Mouse click on sub menu
//        $(".notification-item, .event-request-item, .message-item, .friend-request-item").mouseup(function () {
//            return false
//        });
//
//        //Mouse click on my account link
//        $(".noti-icon,.event-request-icon,.message-icon,.friend-request-icon").mouseup(function () {
//            return false
//        });
//
//
//        //Document Click
//        $(document).mouseup(function () {
//            $(".notification-item, .event-request-item, .message-item, .friend-request-item").hide();
//            $(".noti-icon,.event-request-icon,.message-icon,.friend-request-icon").attr('id', '');
//        });
//        // =================================================================================================================
//        // get notification
//        // socket
//        homeSocket.emit('join',{userId:$scope.global.userId},function(result){
//            console.log('heellll');
//        });
//        // get friendRequest, notification, event request and alarm unread count
//        return $q.all([
//                $http.get('/api/notificationUnreadCount/'+$scope.global.userId),
//                $http.get('/api/friendRequestUnreadCount/'+$scope.global.userId),
//                $http.get('/api/eventRequestUnreadCount/'+$scope.global.userId),
//                $http.get('/api/messageUnreadCount/'+$scope.global.userId)
//            ]).then(function(res){
//                // seperate data to easily control
//                $scope.notificationUnreadCount = res[0].data.count;
//                $scope.friendRequestUnreadCount = res[1].data.count;
//                $scope.eventRequestUnreadCount = res[2].data.count;
//                $scope.messageUnreadCount = res[3].data.count;
//            });
//    }

}])




