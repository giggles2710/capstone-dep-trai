/**
 * Created by Noir on 1/13/14.
 */
'use strict'

function MiFriendRequestDirective($http){
    return{
        restrict:'EA',
        templateUrl: '/request-box.html',
        scope:{},
        controller:function($scope){
            $scope.count = 0;
            $scope.requests = [];
            $scope.isLoading = false;
            $scope.isExpand = false;

            $scope.confirm = function(fromId){
                console.log(fromId);
            }

            $scope.showUnread = function(){
                if(!$scope.isExpand){
                    $scope.isLoading = true;
                    // show unread
                    $http({
                        method: 'GET',
                        url:'/api/getFriendRequest',
                        headers:{'Content-Type':'application/x-www-form-urlencoded'}
                    })
                        .success(function(data, status){
                            for(var i=0;i<data.length;i++){
                                $scope.requests.push(data[i]);
                            }
                            $scope.isLoading = false;
                            $scope.isExpand = true;
                        })
                        .error(function(data, status){
                            $scope.isLoading = false;
                        })
                }else{
                    $scope.isExpand = false;
                }
            }
        },
        link:function(scope, ele, attrs, ctrl){
            // count unread notifications
            $http({
                method: 'GET',
                url:'/api/countUnreadFRequest',
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(status, data){
                    scope.count = data;
                })
                .error(function(status, data){
                    scope.count = 0;
                });
        }
    }
}