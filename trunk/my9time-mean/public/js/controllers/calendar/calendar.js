/**
 * Created by Noir on 2/11/14.
 */
'use strict'

angular.module('my9time.calendar').controller('CalendarController',['$scope','$http','$location','Calendar','Modal','UserSession','Event',function($scope, $http, $location,Calendar,modal,Session,Event){
    var date = new Date();
    $scope.default = {
        dates: [date.getDate(),1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [(date.getMonth()+1),1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears(),
        hours:[1,2,3,4,5,6,7,8,9,10,11,12],
        minutes:[0,10,20,30,40,50],
        steps:['AM','PM']
    };
    //get all years
    function getAllYears(){
        var years = [];
        for(var i=new Date().getFullYear();i < new Date().getFullYear() +10;i++){
            years.push(i);
        }

        return years;
    }
    $scope.message = '';
    $scope.pickedDate = '';
    $scope.pickYear = '';
    $scope.pickMonth= '';
    $scope.pickDay = '';
    $scope.global = Session;
    var currentView = "month";
//    //event source that pulls from google.com
//    $scope.eventSource = {
//        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
//        className: 'gcal-event',           // an option!
//        currentTimezone: 'America/Chicago' // an option!
//    };

    // initialize events in default
    // add another event by similar way
    // Phương thức lấy danh sách bài post

    $scope.find = function() {
        Calendar.query(function(returnEvents) {
            returnEvents.forEach(function(event){
                $scope.events.push(event);
            })
        });
    };
     $scope.events = [

     ];

    // event handler when click on any day
    $scope.dayClick = function( date, allDay, jsEvent, view ){
        $scope.pickedDate = new Date(date);
        $scope.pickYear= $scope.pickedDate.getFullYear();
        $scope.pickMonth = $scope.pickedDate.getMonth();
        $scope.pickDay= $scope.pickedDate.getDate();
        modal.open($scope,'/views/component/createEventCalendarPopup.html',function(res){
            //what's next ?
            var query = '/api/getFriendToken/'+$scope.global.userId+'/off';
            $('input.token-input').tokenInput(
                query,
                {
                    theme:'facebook',
                    hintText:"Type in your friend's name",
                    noResultsText: "No friend is matched."
                }
            );
            $(".token-input-dropdown-facebook").css("z-index","9999");
        });

    };

    // create event  by clicking calendar
    $scope.createEventCalendar = function(a,b,c){
        var date1 = Number(a);
        var month1= Number(b);
        var year1= Number(c);
        var event = new Event({
            userId:$scope.global.userId,
            name :$scope.name,
            date1: date1,
            month1: month1,
            year1: year1,
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
            privacy: $scope.privacy
            //color:$scope.color,
            //alarm:$scope.alarm

        });
        event.$save(function(response){
            if(!response){
                $scope.isCreateError = true;
                $scope.createError = "Sorry about this !"
            }
            else{
                $http({
                    method:'PUT',
                    url:'/api/invite/',
                    data: $.param({eventId: $scope.eventId, friends: $scope.friends, invitors: $scope.invitors}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        // close modal
                        modal.close();
                    });
                modal.close();
                $location.path('/event/view/'+ response._id);
                //$location.path('/calendar');
            }


        })
    }

    // event handler when drop an event
    $scope.dropEvent = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
        $scope.message = 'Event droped to make dayDelta ' + dayDelta;
        apply();
    };

    // event handler when resize an event
    $scope.resizeEvent = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
        $scope.message = 'Event resized to make dayDelta ' + minuteDelta;
        apply();
    };

    // event handler when click an event
    $scope.clickEvent = function(event){
        $scope.message = event.title + ' is clicked';
        apply();
    };

    // add new event
    $scope.addEvent = function(){
        // first, add it in server
        // second, add it in client - angular
        $scope.message = 'New task created';
        $scope.events.push({
            title: 'New Task',
            start: date,
            end: date
        });
    }

    // remove event
    $scope.removeEvent = function(){
        // first, remove it in server
        // second, remove it in client
    }

    //with this you can handle the events that generated by each page render process
    $scope.renderView = function(view){
        var date = new Date(view.calendar.getDate());
        $scope.currentDate = date.toDateString();
//        $scope.message = 'Page render with date '+ $scope.currentDate;
        apply();
    };


    //with this you can handle the events that generated when we change the view i.e. Month, Week and Day
    $scope.changeView = function(view,calendar) {
        currentView = view;
        calendar.fullCalendar('changeView',view);
        $scope.message = 'You are looking at '+ currentView;
        apply();
    };

    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
            header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            dayClick: $scope.dayClick,
            eventDrop: $scope.dropEvent,
            eventResize: $scope.resizeEvent,
            eventClick: $scope.clickEvent,
            viewRender: $scope.renderView
        }
    };

    function apply(){
        if(!$scope.$$phase) {
            //$digest or $apply
            $scope.$apply();
        }
    }

    /* event sources array*/
    $scope.eventSources = [$scope.events];
}]);