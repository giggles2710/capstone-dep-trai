/**
 * Created by Noir on 2/11/14.
 */
'use strict'

angular.module('my9time').controller('CalendarController',['$scope','$http','$location',function($scope, $http, $location){
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.eventChanged = 0;

    $scope.events = [
        {
            title: 'All Day Event',
            start: new Date(y, m, 1)},
        {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2)},
        {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d - 3, 16, 0),
            allDay: false},
        {
            id: 999,
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16, 0),
            allDay: false},
        {
            title: 'Event 1',
            start: new Date(y, m, d, 10, 30),
            allDay: false},
        {
            title: 'Event 2',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false},
        {
            title: 'Event 3',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            allDay: false},
        {
            title: 'Event with url',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            url: 'http://google.com/'}]

    $scope.addEvent = function() {
        $scope.events.push({
            title: 'New event',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29)
        });
        $scope.events.dirty = true;
        $scope.eventChanged = $scope.eventChanged + 1;
    }

    $scope.remove = function(index) {
        $scope.events.splice(index,1);
        $scope.events.dirty = true;
        $scope.eventChanged = $scope.eventChanged + 1;
    }
}]);