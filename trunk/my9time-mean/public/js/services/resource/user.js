/**
 * Created by Noir on 1/17/14.
 */
'use strict'

angular.module('my9time.user').factory('Users',['$resource', function($resource){
    return $resource('users/:userId',{
        userId:'@_id'
    },{
        update:{
            method: 'PUT'
        }
    });
}]);
