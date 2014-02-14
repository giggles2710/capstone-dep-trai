/**
 * Created by ConMeoMauDen on 14/02/2014.
 */

'use strict'

angular.module('my9time.admin').factory('Admins',['$resource', function($resource){
    return $resource('/api/admins/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        }
    });
}]);
