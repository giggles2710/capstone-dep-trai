/**
 * Created by TrungNM on 18/01/2014.
 */

angular.module('my9time.group').factory('Groups',['$resource', function($resource){
    return $resource('groups/:groupID',{
        groupID:'@_id'
    },{
        update:{
            method: 'PUT'
        }
    });
}]);

