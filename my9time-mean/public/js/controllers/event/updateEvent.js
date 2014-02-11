/**
 * Created by Nova on 2/12/14.
 */
angular.module('my9time.event').controller('createEvent', ['$scope' , '$location','UserSession', 'Event' ,function($scope , $location ,Session, Event){

    $scope.update = function() {
        var event = $scope.event;
        Event.$update(function(event) {
            $location.path('event/view/' + event._id);
        });
    };


}]);