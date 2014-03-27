/**
 * Created by Noir on 3/26/14.
 */
'use strict'

angular.module('my9time')
    .directive('miReport',['$http', 'Modal', MiReport]);

function MiReport($http,modal){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/reportButton.html',
        scope:{
            target: '@target',
            type: '@type'
        },
        controller:function($scope){
            $scope.isLoading = true;
            $scope.isReported = false;

            $scope.report = function(){
                $scope.isLoading = true;
                $http({
                    method:'PUT',
                    url:'/api/report/'+$scope.target+'?type='+$scope.type
                })
                    .success(function(res){
                        $scope.isLoading = false;
                        $scope.isReported = true;
                    })
                    .error(function(res){
                        // open modal announce error
                        modal.open($scope,'/views/component/errorReport.html',function(res){
                            $scope.isLoading = false;
                        });
                    });
            }


        },
        link: function(scope, ele, attrs, ctrl){
            scope.isLoading = false;
        }
    }
};


