/**
 * Created by Nova on 2/18/14.
 */
angular.module('my9time.event')
    .directive('miLike',['$http','EventSocket', MiLike]);

function MiLike($http,eventSocket){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/likeButton.html',
        scope:{
            eventID :'@event'
        },
        controller:function($scope){
            $scope.isLoading = true;
            $scope.button = {}
            $scope.communicate = function(){
                if($scope.likeStatus=='Like'){
                    // then un-like
                    unLike();
                }else if($scope.likeStatus == 'unLike'){
                    // then like
                    like();
                }
            }

            this.updateLikeStatus = updateLikeStatus;

            function updateLikeStatus(isLike,length){
                //$scope.likeStatus = isLike;
                if(isLike=='Like'){
                    $scope.button.name = 'unlike';
                    $scope.button.status = 'fa fa-heart';
                    $scope.button.label = length;
                }else if(isLike == 'unLike'){
                    $scope.button.name = 'like';
                    $scope.button.status = 'fa fa-heart-o';
                    $scope.button.label = length;
                }
                // hide loading button
                $scope.isLoading = false;
            }

            function like(){
                // show loading button
                $scope.isLoading = true;
                // call like now
                $http({
                    method:'PUT',
                    url:'/api/like',
                    data: $.param({eventID: $scope.eventID }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data.isLike == 'Like'){
                            // change button to confirm request
                            $scope.likeStatus ="Like";
                            eventSocket.emit('newLike',{'postId':$scope.eventID});
                            $scope.numberOfLike = $scope.numberOfLike +1;
                            updateLikeStatus('Like',($scope.numberOfLike));

                        }

                    });
            }
            function unLike(){
                // show loading button
                $scope.isLoading = true;
                // call like now
                $http({
                    method:'PUT',
                    url:'/api/unLike',
                    data: $.param({eventID: $scope.eventID }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data.isLike == 'unLike'){
                            // change button to confirm request
                            $scope.likeStatus ='unLike'
                            $scope.numberOfLike = $scope.numberOfLike - 1;
                            updateLikeStatus('unLike',$scope.numberOfLike);
                        }
                    });
            }
        }
        ,link: function(scope, ele, attrs, ctrl){
            $http({
                method:'GET',
                url:'/api/isLike',
                params: {eventID: attrs.event},
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(res){
                    scope.likeStatus = res.isLike;
                    scope.numberOfLike = res.length;
                    ctrl.updateLikeStatus(res.isLike,res.length);
                })
                .error(function(res){
                    console.log('error: ' + res);
                });
        }
    }
};


