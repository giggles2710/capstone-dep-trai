/**
 * Created by Noir on 1/10/14.
 */
'use strict'

function MiFriendDirective($http){
    return {
        restrict: 'EA',
        templateUrl: '/add-friend-button.html',
        scope:{},
        controller:function($scope){
            $scope.isLoading = true;

            $scope.button = {}
            $scope.communicate = function(){
                if($scope.friendStatus=='added'){
                    // then un-friend
                    unfriend();
                }else if($scope.friendStatus == 'waiting'){
                    // then cancel request
                    cancelRequest();
                }else if($scope.friendStatus == 'unknown'){
                    // then add friend
                    addFriend();
                }else if($scope.friendStatus == 'need-confirm'){
                    // then confirm request
                    confirmRequest();
                }
            }

            this.updateFriendStatus = updateFriendStatus;

            function updateFriendStatus(data){
                $scope.friendStatus = data;
                if(data=='added'){
                    $scope.button.name = 'unfriend';
                    $scope.button.status = 'btn-warning';
                    $scope.button.label = 'Unfriend';
                }else if(data == 'waiting'){
                    $scope.button.name = 'cancelRequest';
                    $scope.button.status = 'btn-danger';
                    $scope.button.label = 'Cancel request';
                }else if(data == 'unknown'){
                    $scope.button.name = 'addFriend';
                    $scope.button.status = 'btn-primary';
                    $scope.button.label = 'Add friend';
                }else if(data == 'need-confirm'){
                    $scope.button.name = 'confirm';
                    $scope.button.status = 'btn-default';
                    $scope.button.label = 'Confirm request';
                }

                // hide loading button
                $scope.isLoading = false;
            }

            function addFriend(){
                // show loading button
                $scope.isLoading = true;
                // call add friend now
                $http({
                    method:'PUT',
                    url:'/api/addFriend',
                    data: $.param({id: $scope.$parent.ownerId }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'need-confirm'){
                            // change button to confirm request
                            updateFriendStatus('need-confirm');
                        }else if(data == 'added'){
                            // change button to cancel request
                            updateFriendStatus('waiting');
                        }
                    });
            }

            function cancelRequest(){
                // show loading button
                $scope.isLoading = true;
                // call add friend now
                $http({
                    method:'PUT',
                    url:'/api/cancelRequest',
                    data: $.param({id: $scope.$parent.ownerId }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'unfriended'){
                            // change button to add friend button
                            updateFriendStatus('unknown');
                        }else if(data == 'need-unfriend'){
                            // change button to unfriend
                            updateFriendStatus('unfriend');
                        }
                    });
            }

            function confirmRequest(){
                // show loading button
                $scope.isLoading = true;
                // call add friend now
                $http({
                    method:'PUT',
                    url:'/api/confirmFriendRequest',
                    data: $.param({id: $scope.$parent.ownerId }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'confirmed'){
                            // change button to add friend button
                            updateFriendStatus('added');
                        }
                    });
            }

            function unfriend(){
                // show loading button
                $scope.isLoading = true;
                // call add friend now
                $http({
                    method:'PUT',
                    url:'/api/unfriend',
                    data: $.param({id: $scope.$parent.ownerId }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'unfriended'){
                            // change button to add friend button
                            updateFriendStatus('unknown');
                        }
                    });
            }
        },
        link:function(scope, ele, attrs, ctrl){
            // check friend status
            $http({
                method: 'GET',
                url:'/api/getFriendStatus/'+scope.$parent.ownerId,
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    if(!data){
                        scope.$parent.isNotMe = false;
                    }

                    ctrl.updateFriendStatus(data);
                });
        }
    }
};


