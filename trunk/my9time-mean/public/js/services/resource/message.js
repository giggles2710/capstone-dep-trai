/**
 * Created by ConMeoMauDen on 14/02/2014.
 */

'use strict'

angular.module('my9time.message').factory('Messages',['$resource', function($resource){
    return $resource('/api/messages/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        }
    });
}]);
