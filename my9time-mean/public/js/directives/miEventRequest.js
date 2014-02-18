/**
 * Created by Noir on 1/13/14.
 */
'use strict'

angular.module('my9time.system')
    .directive('miJoinEvent',['$http', MiJoinEvent]);

function MiJoinEvent($http){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/joinEventButton.html',
        scope:{ },
        controller:function($scope){
            var curEventId = '';
            $scope.isLoading = true;
            $scope.button = {};

            $scope.communicate = function(){
                if($scope.status=='joined'){
                    // then un-friend
                    quitEvent();
                }else if($scope.status == 'waiting'){
                    // then cancel request
                    cancelRequest();
                }else if($scope.status == 'unknown'){
                    // then add friend
                    joinEvent();
                }
            }

            this.updateStatus = updateStatus;

            function updateStatus(data){
                $scope.status = data;
                if(data=='joined'){
                    $scope.button.name = "quit";
                    $scope.button.status = 'btn-warning';
                    $scope.button.label = "I'm busy";
                }else if(data == 'waiting'){
                    $scope.button.name = 'cancelRequest';
                    $scope.button.status = 'btn-danger';
                    $scope.button.label = 'Cancel request';
                }else if(data == 'unknown'){
                    $scope.button.name = 'joinEvent';
                    $scope.button.status = 'btn-primary';
                    $scope.button.label = 'Join event';
                }

                // hide loading button
                $scope.isLoading = false;
            }

            function joinEvent(){
                // show loading button
                $scope.isLoading = true;
                // call add friend now
                $http({
                    method:'PUT',
                    url:'/api/joinEvent',
                    data: $.param({userId: $scope.$parent.global.userId},{eventId:curEventId}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'joined'){
                            // change button to cancel request
                            updateStatus('waiting');
                        }
                    });
            }

            function cancelRequest(){
                // show loading button
                $scope.isLoading = true;
                // call add friend now
                $http({
                    method:'PUT',
                    url:'/api/cancelEventRequest',
                    data: $.param({userId: $scope.$parent.global.userId},{eventId:curEventId}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'canceled'){
                            // change button to add friend button
                            updateStatus('unknown');
                        }else if(data == 'need-quit'){
                            // change button to unfriend
                            updateStatus('quited');
                        }
                    });
            }

            function quitEvent(){
                // show loading button
                $scope.isLoading = true;
                // call add friend now
                $http({
                    method:'PUT',
                    url:'/api/quitEvent',
                    data: $.param({userId: $scope.$parent.global.userId},{eventId:curEventId}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'quited'){
                            // change button to add friend button
                            updateStatus('unknown');
                        }
                    });
            }
        },
        link: function(scope, ele, attrs, ctrl){
            ctrl.updateStatus(attrs.status);
        }
    }
};