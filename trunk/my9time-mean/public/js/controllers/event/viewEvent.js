
/**
 * Created by Nova on 2/10/14.
 */
angular.module('my9time.event').controller('createEvent', ['$scope' , '$location','UserSession', 'Event' ,function($scope , $location ,Session, Event,$routeParams){
    $scope.findOne = function() {
        Event.get({
            id: $routeParams.id
        }, function(event) {
            $scope.event = event;
        });
    };

}]);
