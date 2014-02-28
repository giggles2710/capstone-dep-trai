/**
 * Created by ConMeoMauDen on 24/02/2014.
 */

var app = angular.module('my9time.event')
    .controller('commentController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', '$fileUploader', 'Event', '$routeParams', function ($rootScope, $location, $scope, $http, Session, Users, $fileUploader, Event, $routeParams) {
        $scope.global = Session;
        $scope.event = '';
        $scope.user = '';
        $scope.event.comment = [
            {
                username: 'TrungNM',
                fullName: 'Minh Trung',
                avatar: '/img/avatar/avatar.png' ,
                datetime: new Date(),
                profileUrl: 'https://github.com/caitp',
                content: 'UI-Commentsss in AngularJS.'

            },
            {
                username: 'TrungNM2',
                fullName: 'Minh Trung',
                avatar: '/img/avatar/avatar.png',
                datetime: new Date(),
                profileUrl: 'https://github.com/caitp',
                content: 'We can have multiple threads of comments at a given moment...'
            },
            {
                username: 'TrungNM3',
                fullName: 'Minh Trung',
                avatar: '/img/avatar/avatar.png',
                datetime: new Date(),
                profileUrl: 'https://github.com/bizarro-caitp',
                content: 'We can do other fancy things too, maybe...'
            }
        ];
        $scope.inputComment = '';


        $scope.findOne = function() {
        console.log('ID:   ' + $routeParams.id);

//            Get event information
            Event.get({
                id: $routeParams.id
            }, function(event) {
                $scope.event = event;
                $scope.startTime =event.startTime;
                $scope.endTime = event.endTime;
                $scope.date1 = event.startTime.getDate();
                $scope.month1 =event.startTime.getMonth();
                $scope.year1 = event.startTime.getFullYear();
                $scope.hour1 =event.startTime.getHours();
                $scope.minute1 = event.startTime.getMinutes();
                if(event.startTime.getHours()>12){
                    $scope.step1 = "PM";
                }
                else $scope.step1 = "AM";
                $scope.date2 = event.endTime.getDate() ;
                $scope.month2 = event.endTime.getMonth();
                $scope.year2 = event.endTime.getFullYear();
                $scope.hour2 = event.endTime.getHours();
                $scope.minute2 = event.endTime.getMinutes();
                if(event.startTime.getHours()>12){
                    $scope.step2 = "PM";
                }
                else $scope.step2 = "AM";
            });

            // Get User information
            Users.getProfile({
                id: $scope.global.userId
            }, function (user) {
                //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
                $scope.user = user;
            });
        };

        $scope.addComment = function(){
            var comment = {
                username: $scope.user.local.username,
                fullName: $scope.user.firstName + " " + $scope.user.lastName,
                avatar: $scope.user.avatar,
                datetime: new Date(),
                content: $scope.inputComment
            }
        // Add vao
            $scope.event.comment.push({avatar:$scope.user.avatar, fullName:$scope.user.firstName, username: $scope.user.local.username, content: $scope.inputComment, datetime: new Date()});

            Event.addComment({id: $routeParams.id},{comment: comment}, function(){

            })
            $scope.inputComment = '';

        };

        $scope.removeComment = function(comment){
            Event.removeComment({id: $routeParams.id},{comment: comment}, function(){

            })
            $scope.event.comment.splice($scope.event.comment.indexOf(comment), 1);
        }


    }]);