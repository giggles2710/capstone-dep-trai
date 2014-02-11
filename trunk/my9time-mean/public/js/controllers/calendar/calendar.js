/**
 * Created by Noir on 2/11/14.
 */
'use strict'

angular.module('my9time.system').controller('CalendarController',['$scope','$http','$location',function($scope, $http, $location){
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.message = '';
    var currentView = "month";
//    //event source that pulls from google.com
//    $scope.eventSource = {
//        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
//        className: 'gcal-event',           // an option!
//        currentTimezone: 'America/Chicago' // an option!
//    };

    // initialize events in default
    // add another event by similar way
     $scope.events = [
     {
         title: 'All Day Event',
         start: new Date('Thu Oct 17 2013 09:00:00 GMT+0530 (IST)')
     },
     {
         title: 'Long Event',
         start: new Date('Thu Oct 17 2013 10:00:00 GMT+0530 (IST)'),
         end: new Date('Thu Oct 17 2013 17:00:00 GMT+0530 (IST)')},
     {
         id: 999,
         title: 'Repeating Event',
         start: new Date('Thu Oct 17 2013 09:00:00 GMT+0530 (IST)'),
         allDay: false
     },
     {
         id: 999,
         title: 'Repeating Event',
         start: new Date(y, m, d + 4, 16, 0),
         allDay: false
     },
     {
         title: 'Birthday Party',
         start: new Date(y, m, d + 1, 19, 0),
         end: new Date(y, m, d + 1, 22, 30),
         allDay: false
     },
     {
         title: 'Click for Google',
         start: new Date(y, m, 28),
         end: new Date(y, m, 29),url: 'http://google.com/'
     }
     ];

    // event handler when click on any day
    $scope.dayClick = function( date, allDay, jsEvent, view ){
        $scope.message = 'Day Clicked ' + date;
        apply();
    };

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