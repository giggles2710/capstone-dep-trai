/**
 * Created by Nova on 2/10/14.
 */
//==========================================================================================================================
// CreatePage Controller
angular.module('my9time.event').controller('createEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http' ,function($scope , $location ,Session, Event, $routeParams, Helper, $http){
    $scope.global = Session;
    var date = new Date();
    $scope.createError = '';
    $scope.isCreateError = false;
    $scope.startTime ='';
    $scope.endTime='';
    $scope.privacy="c";
    $scope.color="ffffff";
    $scope.alarm = true;
    $scope.default = {
        dates: [date.getDate(),1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [(date.getMonth()+1),1,2,3,4,5,6,7,8,9,10,11,12],
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
            color:$scope.color,
            alarm:$scope.alarm

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
        var today = new Date();
        years.push(today.getFullYear());
        for(var i=new Date().getFullYear();i < new Date().getFullYear() +10;i++){
            years.push(i);
        }

        return years;
    }



}]);




//===============================================================================================================================================================================================================
//View,Edit page Controller

angular.module('my9time.event').controller('viewEventController', ['$scope' , '$location','UserSession', 'Event', '$routeParams', 'Helper','$http' ,function($scope , $location ,Session, Event, $routeParams, Helper, $http){
    $scope.date = new Date();
    $scope.default = {
        dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[15,30,45],
        steps:['AM','PM']
    };
    $scope.global = Session;
    $scope.updateError = '';
    $scope.isUpdateError = false;

    //get all years
    function getAllYears(){
        var years = [];
        var today = new Date();
        years.push(today.getFullYear());
        for(var i=new Date().getFullYear();i < new Date().getFullYear() +10;i++){
            years.push(i);
        }

        return years;
    }

    // format date
    function formatFullDate(input){
        var date = new Date(input);
        date.setMonth(date.getMonth()+1);
        return date.getHours() + ':' + date.getMinutes() + ' ,' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    }


    // get event
    $scope.findOne = function() {
        Event.get({
            id: $routeParams.id
        }, function(event) {
            // convert string to date time
            var startTime = new Date(event.startTime);
            var endTime = new Date(event.endTime);
            // init
            $scope.event = event;
            $scope.event.startTime =event.startTime;
            $scope.event.endTime = event.endTime;
            $scope.date1 = startTime.getDate();
            $scope.month1 =startTime.getMonth();
            $scope.year1 = startTime.getFullYear();
            $scope.hour1 =startTime.getHours();
            $scope.minute1 = startTime.getMinutes();
            if(startTime.getHours()>12){
                $scope.step1 = "PM";
            }
            else $scope.step1 = "AM";
            $scope.date2 = endTime.getDate() ;
            $scope.month2 = endTime.getMonth();
            $scope.year2 = endTime.getFullYear();
            $scope.hour2 = endTime.getHours();
            $scope.minute2 = endTime.getMinutes();
            if(startTime.getHours()>12){
                $scope.step2 = "PM";
            }
            else $scope.step2 = "AM";
            $scope.event = event;
        });
    };

    // update all of event
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
                $scope.event.startTime =formatFullDate(data.startTime);
                $scope.event.endTime=formatFullDate(data.endTime);
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

    // get event intro
    $scope.getIntro = function(){
        $http({
            method: 'GET',
            url:    '/api/getEventIntro',
            data: $.param({eventId: $routeParams.id}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // update $scope
                $scope.event.name= data.name;
                $scope.event.startTime =formatFullDate(data.startTime);
                $scope.event.endTime=formatFullDate(data.endTime);
                $scope.event.location=data.location;
                $scope.event.description=data.description;

            })
            .error(function(err){
                $scope.isUpdateError= true;
                $scope.updateError= err;
            })
    };

    // get event announcement
    $scope.getAnnouncement = function(){
        $http({
            method: 'GET',
            url:    '/api/getAnnouncement',
            data: $.param({eventId: $routeParams.id}),
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


    //===========================================================================================================
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
