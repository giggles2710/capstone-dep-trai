/**
 * Created by Noir on 2/28/14.
 */

angular.module('my9time.event')
    .controller('messagePopupController',['$scope','$http','UserSession',function($scope,$http,Global){
        $scope.session = Global;

//
        $scope.send = function(){
            console.log('send');
            // $modalInstance.close();
        }

        $scope.cancel = function(){
            console.log('cancel')
            // $modalInstance.dismiss('cancel');
        }
    }]);
