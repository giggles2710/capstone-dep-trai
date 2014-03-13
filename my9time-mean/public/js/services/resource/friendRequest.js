/**
 * Created by Noir on 1/17/14.
 */

'use strict'

angular.module('my9time.notification').factory('FriendRequest',['$resource', function($resource){
    return $resource('/api/friendRequest/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        },
        getForNotification:{
            method  :   'GET',
            url     :   '/api/getFriendRequestForNotification/:userId',
            isArray :   true
        },
        confirmRequest:{
            method  :   'PUT',
            url     :   '/api/confirmFriendRequest'
        },
        rejectRequest:{
            method  :   'PUT',
            url     :   '/api/rejectFriendRequest'
        }
    });
}]);