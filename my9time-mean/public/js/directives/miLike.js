/**
 * Created by Nova on 2/18/14.
 */
angular.module('my9time')
    .directive('miLike',['$http', MiLike]);

function MiLike($http){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/likeButton.html',
        scope:{
            eventID :'@event'
        },
        controller:function($scope){
            $scope.isLoading = true;
            $scope.communicate = function(){
                if($scope.likeStatus=='like'){
                    // then un-like
                    unLike();
                }else if($scope.likeStatus == 'unlike'){
                    // then like
                    like();
                }
            }

            this.updateLikeStatus = updateLikeStatus;

            function updateLikeStatus(isLike,length){
                if(isLike=='Like'){
                    $scope.button.name = 'unlike';
                    $scope.button.status = 'fa fa-heart';
                    $scope.button.label = length;
                }else if(isLike == 'Unlike'){
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
                    data: $.param({id: $scope.eventID }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'Like'){
                            // change button to confirm request
                            updateLikeStatus('unLike');
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
                    data: $.param({id: $scope.eventID }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'unLike'){
                            // change button to confirm request
                            updateLikeStatus('Like');
                        }
                    });
            }
        }
        ,link: function(scope, ele, attrs, ctrl){
            $http({
                method:'GET',
                url:'/api/isLike/',
                data: $.param({eventID: attrs.event }),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(res){
                    console.log('get like status');
                    scope.likeStatus = res.isLike;
                    ctrl.updateLikeStatus(res.isLike,res.length);
                })
                .error(function(res){
                    console.log('error: ' + res);
                });
        }
    }
};


