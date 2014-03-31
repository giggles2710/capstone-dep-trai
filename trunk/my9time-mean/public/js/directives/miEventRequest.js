/**
 * Created by Noir on 1/13/14.
 */
'use strict'

angular.module('my9time.event')
    .directive('miInviteMore',['$http','Modal','UserSocket', MiInviteMore])
    .directive('miJoinEvent',['$http','UserSocket', MiJoinEvent]);

function MiInviteMore($http,modal,userSocket){
    return {
        restrict: 'EA',
        transclude: true,
        templateUrl: '/views/component/inviteMoreButton.html',
        scope:{
            eventId: '@event'
        },
        controller: function($scope){
            $scope.openModal = function(){
                // open modal
                modal.open($scope,'/views/component/inviteMoreModal.html',function(){
                    var query = '/api/getFriendToken/'+$scope.$parent.global.userId+'/'+$scope.eventId;
                    $('input.token-input').tokenInput(
                        query,
                        {
                            theme:'facebook',
                            hintText:"Type in your friend's name",
                            noResultsText: "No friend is matched.",
                            preventDuplicates: true
                        }
                    );
                    $(".token-input-dropdown-facebook").css("z-index","9999");
                });
            }

            $scope.invite = function(){
                if(!$scope.invitors) $scope.invitors = [];
                // submit friends that invited
                $http({
                    method:'PUT',
                    url:'/api/invite/',
                    data: $.param({eventId: $scope.eventId, friends: $scope.friends, invitors: $scope.invitors}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        // emit an event to update event request
                        userSocket.emit('eventRequestSent',{users:data});
                        // close modal
                        modal.close();
                    });
            }
        },
        link:function(scope,attrs,ele,ctrl){}
    }
}

function MiJoinEvent($http,userSocket){
    return {
        restrict: 'EA',
        transclude: true,
        templateUrl: '/views/component/joinEventButton.html',
        scope:{
            event: '@event',
            privacy: '@privacy'
        },
        controller:function($scope){
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
                }else if($scope.status == 'need-confirm'){
                    // then confirm event request
                    confirmRequest();
                }
            }

            this.updateStatus = updateStatus;

            function updateStatus(data){
                $scope.status = data;
                if(data=='joined'){
                    $scope.button.name = "quit";
                    $scope.button.status = 'btn-warning';
                    $scope.button.label = "Leave";
                }else if(data == 'waiting'){
                    $scope.button.name = 'cancelRequest';
                    $scope.button.status = 'btn-danger';
                    $scope.button.label = 'Cancel request';
                }else if(data == 'unknown'){
                    $scope.button.name = 'joinEvent';
                    $scope.button.status = 'btn-primary';
                    $scope.button.label = 'Join';
                }else if(data == 'need-confirm'){
                    $scope.button.name = 'confirmERequest';
                    $scope.button.status = 'btn-default';
                    $scope.button.label = 'Confirm request';
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
                    data: $.param({userId: $scope.$parent.global.userId,eventId:$scope.event,privacy:$scope.privacy}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(!data.error){
                            updateStatus(data);
                            // emit a socket to create notification and notice to ur friend
                            userSocket.emit('eventRequestSent',{eventId: $scope.event});
                        }else{
                            console.log('Event Request directive error: ' + err);
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
                    data: $.param({userId: $scope.$parent.global.userId,eventId:$scope.event}),
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
                    data: $.param({userId: $scope.$parent.global.userId,eventId:$scope.event}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'quited'){
                            // change button to add friend button
                            updateStatus('unknown');
                        }
                    });
            }

            function confirmRequest(){
                // show loading button
                $scope.isLoading = true;
                // call add friend now
                $http({
                    method:'PUT',
                    url:'/api/confirmEventRequest',
                    data: $.param({userId: $scope.$parent.global.userId,eventId:$scope.event}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'confirmed'){
                            // change button to add friend button
                            updateStatus('joined');
                        }
                    });
            }
        },
        link: function(scope, ele, attrs, ctrl){
            $http({
                method: 'GET',
                url:'/api/getEventRequestStatus/'+attrs.event,
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    if(data.error){
                        // log bug
                        console.log(data.error);
                    }else{
                        console.log('status: ' + data);
                        ctrl.updateStatus(data);
                    }
                });
        }
    }
};