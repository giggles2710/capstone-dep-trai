/**
 * Created by Nova on 2/18/14.
 */

angular.module('my9time')
    .directive('miShare',['$http', MiShare]);

function MiShare($http){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/shareButton.html',
        scope:{ },
        controller:function($scope){
            $scope.isLoading = true;

            $scope.button = {}
            $scope.communicate = function(){
                if($scope.shareStatus=='Success'){
                    // then un-friend
                    share();
                }else if($scope.shareStatus == 'Shared'){
                    // then cancel request
                    share();
                }
            }

            this.updateLikeStatus = updateLikeStatus;

            function updateLikeStatus(data){
                $scope.status = data;
                if(data=='Success'){
                    $scope.button.name = 'share';
                    $scope.button.status = 'btn-warning';
                    $scope.button.label = 'Share';
                    $scope.isLoading = false;
                }else if(data == 'Shared'){
                    $scope.isLoading = true;
                }
                // hide loading button

            }

            function like(){
                // show loading button
                $scope.isLoading = true;
                // call share now
                $http({
                    method:'PUT',
                    url:'/api/share',
                    data: $.param({id: $scope.$parent.ownerId }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'Success'){
                            // change button to confirm request
                            updateLikeStatus('Success');
                        }else if(data == 'Shared'){
                            // change button to cancel request
                            updateLikeStatus('Shared');
                        }
                    });
            }
        },
        link: function(scope, ele, attrs, ctrl){
            ctrl.updateLikeStatus(attrs.status);
        }
    }
};