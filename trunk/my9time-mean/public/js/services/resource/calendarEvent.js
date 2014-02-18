/**
 * Created by Noir on 1/17/14.
 * Updated by Nova on 2/17/14.
 */

angular.module('my9time.calendar').factory('Calendar',['$resource', function($resource){
    return $resource('/api/calendar/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        }
    });
}]);