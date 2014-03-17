/**
 * Created by Nova on 2/18/14.
 */

angular.module('my9time')
    .directive('miShare',['$http', MiShare]);

function MiShare($http){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/shareButton.html',
        scope:{eventID :'@event'},
        controller:function($scope){
            $scope.isLoading = true;
            $scope.button = {}
            $scope.communicate = function(){
                if($scope.isShared=='false'){
                    // then share
                    share();
                }
            }
            function share(){
                // show loading button
                $scope.isLoading = true;
                // call share now
                $http({
                    method:'PUT',
                    url:'/api/share',
                    data: $.param({eventID: $scope.eventID }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'Like'){
                            // change button to confirm request
                            $scope.likeStatus ="Like";
                            updateShareStatus('true');
                        }
                    });
            }
            this.updateShareStatus = updateShareStatus;

            function updateShareStatus(data){
                if(data=='false'){
                    $scope.isLoading = false;
                    $scope.button.name = 'share';
                    $scope.button.status = 'fa fa-share-square-o fa-fw';
                }else if(data == 'true'){
                    $scope.isLoading = true;
                }
            }
        }
        ,link: function(scope, ele, attrs, ctrl){
            $http({
                method:'GET',
                url:'/api/isShare',
                data: $.param({eventID: attrs.event }),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(res){
                    console.log('get share status');
                    scope.isShared = res;
                    ctrl.updateShareStatus(res);
                })
                .error(function(res){
                    console.log('error: ' + res);

                });
        }
    }
};
