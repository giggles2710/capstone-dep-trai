
'use strict'



angular.module('my9time.user', ['ngResource']).factory('Users',['$resource', function($resource){
    return $resource('http://42.119.51.198:8080/api/users/:id',{
        id:'@_id'
    },{
        getProfile:{
            method: 'GET',
            url:'http://42.119.51.198:8080/api/profile/:id'
        }
    });
}]);
