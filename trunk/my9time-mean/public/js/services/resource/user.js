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
            method: 'POST',
            url:'/api/users/uploadAvatar'
        }
    });
}]);
