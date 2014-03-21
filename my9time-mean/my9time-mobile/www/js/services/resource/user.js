
'use strict'



angular.module('my9time.user', ['ngResource']).factory('Users',['$resource', '$rootScope', function($resource, $rootScope){
    return $resource($rootScope.LOCALHOST + '/api/users/:id',{
        id:'@_id'
    },{
        getProfile:{
            method: 'GET',
            url: $rootScope.LOCALHOST + '/api/profile/:id'
        },
        addTodo:{
            method: 'post',
            url:$rootScope.LOCALHOST + '/api/users/addTodo'
        },
        removeTodo:{
            method: 'post',
            url:$rootScope.LOCALHOST + '/api/users/removeTodo'
        }
        ,
        changeStatusTodo:{
            method: 'post',
            url:$rootScope.LOCALHOST + '/api/users/changeStatusTodo'
        }
    });
}]);
