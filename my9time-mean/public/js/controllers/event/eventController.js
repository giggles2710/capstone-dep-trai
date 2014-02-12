/**
 * Created by Nova on 2/10/14.
 */
angular.module('my9time.event').controller('eventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams' ,function($scope , $location ,Session, Event, $routeParams){
    $scope.global = Session;
    $scope.event = {
        name :"",
        start:"",
        end:"",
        description:"",
        location:"",
        privacy:"",
        color:""
    };

    // create event
    $scope.create = function(){
        var event = new Event({
            userId:$scope.global.userId,
            name :$scope.event.name,
            start:$scope.event.start,
            end  :$scope.event.end,
            description :$scope.event.description,
            location: $scope.event.location,
            privacy: $scope.event.privacy,
            color:$scope.event.color

        });
        event.$save(function(response){
            console.log("dc roi ne");
            //chuyen trang
            $location.path('/event/view/'+ response.id);


        })
    }


    // get event
    $scope.findOne = function() {
        Event.get({
            id: $routeParams.id
        }, function(event) {
            $scope.event = event;
        });
    };

    // update event
    $scope.update = function() {
        var event = $scope.event;
        Event.$update(function(event) {
            $location.path('event/view/' + event._id);
        });
    };
}]);

