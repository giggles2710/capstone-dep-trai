/**
 * Created by Nova on 2/10/14.
 */
angular.module('my9time.event').factory('Event',['$resource', function($resource){
    return $resource('/api/event/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        }


    });
}]);

