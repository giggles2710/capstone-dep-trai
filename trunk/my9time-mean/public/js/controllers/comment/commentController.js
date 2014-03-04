/**
 * Created by ConMeoMauDen on 24/02/2014.
 */

var app = angular.module('my9time.event')
    .controller('commentController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', '$fileUploader', 'Event', '$routeParams', '$modal', '$log', function ($rootScope, $location, $scope, $http, Session, Users, $fileUploader, Event, $routeParams, $modal, $log) {
        $scope.global = Session;
        $scope.event = '';
        $scope.user = '';
        $scope.inputComment = '';
        $scope.items = ['item1', 'item2', 'item3'];

        // Tìm EventDetail
        $scope.findOne = function() {
        console.log('ID:   ' + $routeParams.id);

//            Get event information
            Event.get({
                id: $routeParams.id
            }, function(event) {
                // TODO: Check lại cho đầy đủ
                $scope.event = event;
                $scope.startTime =event.startTime;
                $scope.endTime = event.endTime;
//                $scope.date1 = event.startTime.getDate();
//                $scope.month1 =event.startTime.getMonth();
//                $scope.year1 = event.startTime.getFullYear();
//                $scope.hour1 =event.startTime.getHours();
//                $scope.minute1 = event.startTime.getMinutes();
//                if(event.startTime.getHours()>12){
//                    $scope.step1 = "PM";
//                }
//                else $scope.step1 = "AM";
//                $scope.date2 = event.endTime.getDate() ;
//                $scope.month2 = event.endTime.getMonth();
//                $scope.year2 = event.endTime.getFullYear();
//                $scope.hour2 = event.endTime.getHours();
//                $scope.minute2 = event.endTime.getMinutes();
//                if(event.startTime.getHours()>12){
//                    $scope.step2 = "PM";
//                }
//                else $scope.step2 = "AM";
            });

            // Get User information
            Users.getProfile({
                id: $scope.global.userId
            }, function (user) {
                //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
                $scope.user = user;
            });
        };

        // Thêm Comment
        // TODO: Cập nhật vào trang đi đcm
        $scope.addComment = function(){
            var comment = {
                username: $scope.user.local.username,
                fullName: $scope.user.firstName + " " + $scope.user.lastName,
                avatar: $scope.user.avatar,
                datetime: new Date(),
                content: $scope.inputComment
            }

            // Add vào trang HTML

            // Làm việc với Server
            Event.addComment({id: $routeParams.id},{comment: comment}, function(event){
                $scope.event.comment.push({_id: event.idComment, avatar:$scope.user.avatar, fullName:$scope.user.firstName, username: $scope.user.local.username, content: $scope.inputComment, datetime: new Date()});

            })
            $scope.inputComment = '';

        };

        // Xóa Comment
        // TODO: coi lại delete nè
        $scope.removeComment = function(comment){
            console.log('Comment:  ' + comment.content);
            Event.removeComment({id: $routeParams.id},{comment: comment}, function(){

            })
            $scope.event.comment.splice($scope.event.comment.indexOf(comment), 1);
        }

    }]);

