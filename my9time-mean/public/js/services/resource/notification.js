/**
 * Created by ConMeoMauDen on 14/02/2014.
 */

'use strict'

angular.module('my9time.notification').factory('Notifications',['$resource', function($resource){
    return $resource('/api/notifications/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        }
    });
}]);
