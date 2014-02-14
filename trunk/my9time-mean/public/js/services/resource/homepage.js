/**
 * Created by Nova on 2/14/14.
 */
angular.module('my9time.homepage').factory('Homepage',['$resource', function($resource){
    return $resource('/api/homepage/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        }


    });
}]);
