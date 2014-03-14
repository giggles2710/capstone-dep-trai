'use strict';

angular.module('myApp', ['ngResource'])
    .factory('Employee', ['$resource',
        function ($resource) {
            return $resource('http://192.168.1.7:8080/api/phone/profile/:id', {});
        }])

