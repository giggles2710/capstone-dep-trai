
'use strict'



angular.module('my9time.user', ['ngResource']).factory('Users',['$resource', '$rootScope', function($resource, $rootScope){
    return $resource($rootScope.LOCALHOST + '/api/users/:id',{
        id:'@_id'
    },{
        getProfile:{
            method: 'GET',
            url: $rootScope.LOCALHOST + '/api/profile/:id'
        },
        getTodo:{
            method: 'GET',
            url:$rootScope.LOCALHOST + '/api/users/getTodolist/:id'
        },
        addTodo:{
            method: 'post',
            url:$rootScope.LOCALHOST + '/mobile/users/addTodo'
        },
        removeTodo:{
            method: 'post',
            url:$rootScope.LOCALHOST + '/mobile/users/removeTodo'
        },
        changeStatusTodo:{
            method: 'post',
            url:$rootScope.LOCALHOST + '/mobile/users/changeStatusTodo'
        }
    });
}]);
