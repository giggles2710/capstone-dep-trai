
'use strict'



angular.module('my9time.user', ['ngResource']).factory('Users',['$resource', '$rootScope', function($resource, $rootScope){
    return $resource($rootScope.LOCALHOST + '/api/users/:id',{
        id:'@_id'
    },{
        getProfile:{
            method: 'GET',
            url: 'http://42.119.51.198:8080/api/profile/:id'
        }
    });
}]);
