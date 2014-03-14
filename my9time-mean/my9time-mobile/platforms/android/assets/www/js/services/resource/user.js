
'use strict'



angular.module('myApp', ['ngResource', 'myApp.controllers']).factory('Users',['$resource', function($resource){
    return $resource('http://192.168.1.7:8080/api/users/:id',{
        id:'@_id'
    },{
        getProfile:{
            method: 'GET',
            url:'http://192.168.1.7:8080/api/phone/profile/:id'
        }
    });
}]);
