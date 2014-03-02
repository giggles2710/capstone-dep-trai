/**
 * Created by Noir on 1/17/14.
 */

'use strict'

angular.module('my9time.notification').factory('EventRequest',['$resource', function($resource){
    return $resource('/api/eventRequest/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        }
    });
}]);