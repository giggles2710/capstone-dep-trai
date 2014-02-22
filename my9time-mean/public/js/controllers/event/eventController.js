/**
 * Created by Nova on 2/10/14.
 */
//==========================================================================================================================
// CreatePage Controller
angular.module('my9time.event').controller('createEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http' ,function($scope , $location ,Session, Event, $routeParams, Helper, $http){
    $scope.global = Session;
    $scope.date = new Date();
    $scope.createError = '';
    $scope.isCreateError = false;
    $scope.startTime ='';
    $scope.endTime='';
    $scope.privacy="c";
    $scope.color="ffffff";
    $scope.default = {
        dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[15,30,45],
        steps:['AM','PM']
    };

        // create event
        $scope.create = function(){
        var event = new Event({
            userId:$scope.global.userId,
            name :$scope.name,
            date1:$scope.date1,
            month1:$scope.month1,
            year1:$scope.year1,
            hour1:$scope.hour1,
            minute1:$scope.minute1,
            step1:$scope.step1,
            date2:$scope.date2,
            month2:$scope.month2,
            year2:$scope.year2,
            hour2:$scope.hour2,
            minute2:$scope.minute2,
            step2:$scope.step2,
            description :$scope.description,
            location: $scope.location,
            privacy: $scope.privacy,
            color:$scope.color

        });
        event.$save(function(response){
            if(!response){
                $scope.isCreateError = true;
                $scope.createError = "Sorry about this !"
            }
            else{
                //chuyen trang
                $location.path('/event/view/'+ response._id);
            }


        })
    }


    //get all years
    function getAllYears(){
        var years = [];

        for(var i=new Date().getFullYear();i < new Date().getFullYear() +10;i++){
            years.push(i);
        }

        return years;
    }


}]);




//===============================================================================================================================================================================================================
//View,Edit page Controller

angular.module('my9time.event').controller('viewEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http' ,function($scope , $location ,Session, Event, $routeParams, Helper, $http){
    $scope.default = {
        dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[15,30,45],
        steps:['AM','PM']
    };
    $scope.global = Session;
    $scope.date = new Date();
    $scope.updateError = '';
    $scope.isUpdateError = false;

    //get all years
    function getAllYears(){
        var years = [];

        for(var i=new Date().getFullYear();i < new Date().getFullYear() +10;i++){
            years.push(i);
        }

        return years;
    }

    // format date
    function formatFullDate( input){
        var date = new Date(input);
        return date.getHours() + ':' + date.getMinutes() + ' ,' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
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

    // update all of event
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
            data: $.param({
                eventId: $scope.event._id,
                name: $scope.event.name,
                date1:$scope.date1,
                month1:$scope.month1,
                year1:$scope.year1,
                hour1:$scope.hour1,
                minute1:$scope.minute1,
                step1:$scope.step1,
                date2:$scope.date2,
                month2:$scope.month2,
                year2:$scope.year2,
                hour2:$scope.hour2,
                minute2:$scope.minute2,
                step2:$scope.step2,
                location: $scope.event.location,
                description: $scope.event.description}),
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
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
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
                $scope.event.announcement=data.announcement;

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };



    // test
    $scope.single = function(image) {
        var formData = new FormData();
        formData.append('image', image, image.name);

        $http.post('uploadImage', formData, {
            headers: { 'Content-Type': false },
            transformRequest: angular.identity
        }).success(function(result) {
                $scope.uploadedImgSrc = result.src;
                $scope.sizeInBytes = result.size;
            });
    };
}]);