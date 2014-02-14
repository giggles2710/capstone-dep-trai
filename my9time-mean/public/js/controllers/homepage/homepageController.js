/**
 * Created by Nova on 2/14/14.
 */
angular.module('my9time.event').controller('HomepageController', ['$scope' , '$location','UserSession', 'Event', '$routeParams' ,function($scope , $location ,Session, Event, $routeParams){
    $scope.global = Session;
    $scope.listAll = function(){
        Event.query(function(events){
            $scope.events = events;
        })
    }


}]);
