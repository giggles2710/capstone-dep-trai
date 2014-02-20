/**
 * Created by Nova on 2/10/14.
 */
angular.module('my9time.event').controller('eventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http' ,function($scope , $location ,Session, Event, $routeParams, Helper, $http){
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

    //

    // check startDate and endDate
    $scope.isValidDate = function(){
        if($scope.start >= $scope.end){
            return $scope.start >= $scope.newUser.passwordConfirm;
        }
    }

    // update event Intro
    $scope.updateIntro = function(){
        $http({
            method: 'PUT',
            url:    '/api/updateEventIntro',
            data: $.param({eventId: $scope.event._id,name: $scope.event.name,startTime: $scope.event.startTime,endTime: $scope.event.endTime, location: $scope.event.location, description: $scope.event.description}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $scope.event.name= data.name;
                $scope.event.startTime =data.startTime;
                $scope.event.endTime=data.endTime;
                $scope.event.location=data.location;
                $scope.event.description=data.description;

            })
            .error(function(data, status){
                //TODO: what's next ?
            })
    };

    // update event Announcement
    $scope.updateAnnouncement = function(){
        $http({
            method: 'PUT',
            url:    '/api/updateAnnouncement',
            data: $.param({eventId: $scope.event._id, announcement: $scope.event.announcement}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $scope.event.name= data.name;
                $scope.event.startTime =data.startTime;
                $scope.event.endTime=data.endTime;
                $scope.event.location=data.location;
                $scope.event.description=data.description;

            })
            .error(function(data, status){
                //TODO: what's next ?
            })
    };

}]);

