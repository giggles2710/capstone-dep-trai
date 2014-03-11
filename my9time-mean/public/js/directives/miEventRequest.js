/**
 * Created by Noir on 1/13/14.
 */
'use strict'

angular.module('my9time.event')
    .directive('miInviteMore',['$http', MiInviteMore])
    .directive('miJoinEvent',['$http','UserSocket', MiJoinEvent]);

function MiInviteMore($http){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/friendTokenInput.html',
        scope:{
            eventId: '@event'
        },
        controller: function($scope){
            $scope.invite = function(){
                // submit friends that invited
                $http({
                    method:'PUT',
                    url:'/api/invite/',
                    data: $.param({eventId: $scope.eventId, friends: $scope.friends, invitors: $scope.invitors}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        // nothing
                        var inviteButton = $('#invite-more-'+$scope.eventId);
                        // hide save button
                        inviteButton.prev().attr('style','display:none;');
                        // hide 2 input
                        inviteButton.next().attr('style','display:none;');
                        // show this
                        inviteButton.show();
                    });
            }
        },
        link:function(scope,attrs,ele,ctrl){
            var query = '/api/getFriendToken/'+scope.$parent.global.userId+'/'+scope.eventId;
            $('input.token-input').tokenInput(
                query,
                {
                    theme:'facebook',
                    hintText:"Type in your friend's name",
                    noResultsText: "No friend is matched."
                }
            ).removeClass('empty');

            $('.toggle-token').on('click',function(){
                var dialog = $(this).next();
                var submitBtn = $(this).prev();

                // open it
                dialog.show();
                dialog.removeClass('hiding');
                // hide add button
                $(this).attr('style','display:none');
                // show submit button
                submitBtn.show();
            });
        }
    }
}

function MiJoinEvent($http,userSocket){
    return {
        restrict: 'EA',
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
                }
            }

            this.updateStatus = updateStatus;

            function updateStatus(data){
                $scope.status = data;
                if(data=='joined'){
                    $scope.button.name = "quit";
                    $scope.button.status = 'btn-warning';
                    $scope.button.label = "leave";
                }else if(data == 'waiting'){
                    $scope.button.name = 'cancelRequest';
                    $scope.button.status = 'btn-danger';
                    $scope.button.label = 'Cancel request';
                }else if(data == 'unknown'){
                    $scope.button.name = 'joinEvent';
                    $scope.button.status = 'btn-primary';
                    $scope.button.label = 'join';
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
                        ctrl.updateStatus(data);
                    }
                });
        }
    }
};