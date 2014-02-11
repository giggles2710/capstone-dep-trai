/**
 * Created by Nova on 2/10/14.
 */
angular.module('my9time.event').controller('createEvent', ['$scope' , '$location','UserSession', 'Event' ,function($scope , $location ,Session, Event){
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
            $location.path('/event/view/'+ response);
        })
    }
}]);

