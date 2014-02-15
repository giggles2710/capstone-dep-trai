/**
 * Created by Nova on 2/10/14.
 */
angular.module('my9time.event').controller('homepageController', ['$scope' , '$location','UserSession', 'Event', '$routeParams' ,function($scope , $location ,Session, Event, $routeParams){
        $scope.global = Session;

        // create event
        $scope.create = function(){
        var event = new Event({
            userId:$scope.global.userId,
            name :$scope.name,
            start:$scope.start,
            end  :$scope.end,
            description :$scope.description,
            location: $scope.location,
            privacy: $scope.privacy,
            color:$scope.color

        });
        event.$save(function(response){
            console.log("dc roi ne");
            //chuyen trang
            $location.path('/event/view/'+ response._id);
        })
            $scope.name ="";
            $scope.start="";
            $scope.end="";
            $scope.description="";
            $scope.location="";
            $scope.privacy="";
            $scope.color="";
    }


    // get event
    $scope.findOne = function() {
        Event.get({
            id: $routeParams.id
        }, function(event,start,end) {
            $scope.event = event;
            $scope.start = start;
            $scope.end = end;
        });
    };

    // update event
    $scope.update = function() {
        var event = $scope.event;
        event.$update(function(event) {
            $location.path('event/view/' + event._id);
        });
    };

    // check startDate and endDate
    $scope.isValidDate = function(){
        if($scope.start >= $scope.end){
            return $scope.start >= $scope.newUser.passwordConfirm;
        }
    }

    // like
    $scope.like = function(status){
        //set lại cái like
    }
}]);
