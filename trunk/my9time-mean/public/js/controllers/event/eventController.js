/**
 * Created by Nova on 2/10/14.
 */
angular.module('my9time.event').controller('eventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper' ,function($scope , $location ,Session, Event, $routeParams, Helper){
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
        }, function(event) {
            $scope.event = event;
//            var startTime = event.start.split('-');
//            var endTime = event.end.split('-');
//            $scope.event.startTime = new Date(startTime[0],startTime[1],startTime[2]);
//            $scope.event.endTime = new Date(endTime[0],endTime[1],endTime[2]);
            $scope.startTime = Helper.formatDate(new Date(event.startTime));
            $scope.endTime = Helper.formatDate(new Date(event.endTime));
        });
    };

    // update event
    $scope.update = function() {
        var event = $scope.event;
        event.$update(function(returnEvent) {
            $location.path('event/view/' + returnEvent._id);
        });
    };

    // check startDate and endDate
    $scope.isValidDate = function(){
        if($scope.start >= $scope.end){
            return $scope.start >= $scope.newUser.passwordConfirm;
        }
    }



}]);

