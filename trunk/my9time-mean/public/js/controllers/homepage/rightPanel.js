/**
 * Created by Noir on 2/20/14.
 */
angular.module('my9time.event').controller('RightPanelController', ['$scope' , '$location','UserSession', 'Event', '$routeParams' , '$q','$http',function($scope , $location ,Session, Event, $routeParams, $q, $http){
    $scope.global = Session;
    $scope.username = $scope.global.username;
    $scope.userId = $scope.global.userId;
    $scope.fullName = $scope.global.fullName;
}]);
