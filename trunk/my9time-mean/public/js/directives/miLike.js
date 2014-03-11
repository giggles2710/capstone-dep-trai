/**
 * Created by Nova on 2/18/14.
 */
angular.module('my9time')
    .directive('miLike',['$http', MiLike]);

function MiLike($http){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/likeButton.html'
//        ,scope:{ },
//        controller:function($scope){
//            $scope.isLoading = true;
//
//            $scope.button = {}
//            $scope.communicate = function(){
//                if($scope.likeStatus=='like'){
//                    // then un-friend
//                    like();
//                }else if($scope.likeStatus == 'unlike'){
//                    // then cancel request
//                    like();
//                }
//            }
//
//            this.updateLikeStatus = updateLikeStatus;
//
//            function updateLikeStatus(data){
//                $scope.status = data;
//                if(data=='Like'){
//                    $scope.button.name = 'unlike';
//                    $scope.button.status = 'btn-warning';
//                    $scope.button.label = 'Unlike';
//                }else if(data == 'Unlike'){
//                    $scope.button.name = 'like';
//                    $scope.button.status = 'btn-danger';
//                    $scope.button.label = 'Like';
//                }
//                // hide loading button
//                $scope.isLoading = false;
//            }
//
//            function like(){
//                // show loading button
//                $scope.isLoading = true;
//                // call like now
//                $http({
//                    method:'PUT',
//                    url:'/api/like',
//                    data: $.param({id: $scope.$parent.ownerId }),
//                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
//                })
//                    .success(function(data, status){
//                        if(data == 'Like'){
//                            // change button to confirm request
//                            updateLikeStatus('Like');
//                        }else if(data == 'Unlike'){
//                            // change button to cancel request
//                            updateLikeStatus('Unlike');
//                        }
//                    });
//            }
//        },
//        link: function(scope, ele, attrs, ctrl){
//            ctrl.updateLikeStatus(attrs.status);
//        }
    }
};


