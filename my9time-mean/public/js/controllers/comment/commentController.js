/**
 * Created by ConMeoMauDen on 24/02/2014.
 */

var app = angular.module('my9time.event')
    .controller('commentController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', '$fileUploader', 'Event', '$routeParams', '$modal', '$log', 'EventSocket', function ($rootScope, $location, $scope, $http, Session, Users, $fileUploader, Event, $routeParams, $modal, $log, eventSocket) {
        $scope.global = Session;
        $scope.user = '';

        // update comment list
        eventSocket.on('updateComment',function(data){
            if($scope.$parent.event){
                $scope.$parent.event.comment.push(data.comment);
            }
        });

        // Tìm EventDetail
        $scope.findOne = function() {
            // Get event information
            Event.get({
                id: $routeParams.id
            }, function(event) {
                $scope.event = event;
                $scope.startTime = event.startTime;
                $scope.endTime = event.endTime;
            });

            // Get User information
            Users.getProfile({
                id: $scope.global.userId
            }, function (user) {
                $scope.user = user;
            });
        };

        // Thêm Comment
        $scope.addComment = function(post){
            if($scope.inputComment && $scope.inputComment!==''){
                // pre-process
                $('#comment-box').attr('disabled','enabled');
                Users.getProfile({
                    id: $scope.global.userId
                }, function (user) {
                    var comment = {
                        userId: user._id,
                        username: user.local.username,
                        fullName: user.firstName + " " + user.lastName,
                        avatar: user.avatar,
                        datetime: new Date(),
                        content: $scope.inputComment
                    }

                    Event.addComment({id: post._id},{comment: comment}, function(event){
                        // Sau khi Save vào database, server sẽ trả về 1 cái ID
                        // Sử dụng các thứ có được ghi ra HTML
                        var newComment = {_id: event.idComment, avatar: comment.avatar, fullName: comment.fullName, username: comment.username, userId: comment.userId, content: comment.content, datetime: event.dateCreated};
//                            post.comment.push(newComment);
                        // Xóa trống chỗ nhập Comment, chuẩn bị cho comment tiếp theo
                        $scope.inputComment = '';
                        // enable comment-box
                        $('#comment-box').removeAttr('disabled');
                        // scroll to bottom
                        $('#list-comment').animate({ scrollTop: $('#list-comment')[0].scrollHeight}, 0);
                        // emit event to server
                        eventSocket.emit('newComment',{'postId':post._id,'comment':newComment});
                    });
                });
            }
        };

        // Xóa Comment
        $scope.removeComment = function(comment){
            Event.removeComment({id: $routeParams.id},{comment: comment}, function(){
                $scope.event.comment.splice($scope.event.comment.indexOf(comment), 1);
            });
        }
    }]);

