/**
 * Created by Noir on 1/17/14.
 */
'use strict'

angular.module('my9time.user').factory('Users',['$resource', function($resource){
    return $resource('/api/users/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT',
            url: '/api/users/edit/:id'
        },
        changePassword:{
            url: '/api/changePassword/:id',
            method: 'PUT'
        },
        getProfile:{
            method: 'GET',
            url:'/api/profile/:id'
        },
        uploadAvatarResource:{
            method: 'post',
            url:'/api/users/uploadAvatar'
        },
        cropAvatar:{
            method: 'post',
            url:'/api/users/cropAvatar'
        },
        getTodo:{
            method: 'GET',
            url:'/api/users/getTodolist/:id'
        },
        addTodo:{
            method: 'post',
            url:'/api/users/addTodo'
        },
        removeTodo:{
            method: 'post',
            url:'/api/users/removeTodo'
        }
        ,
        changeStatusTodo:{
            method: 'post',
            url:'/api/users/changeStatusTodo'
        }

    });
}]);
