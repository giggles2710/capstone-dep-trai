/**
 * Created by TrungNM on 18/01/2014.
 */
'use strict'

angular.module('my9time.group').factory('Groups',['$resource', function($resource){
    return $resource('/api/groups/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        }
    });
}]);

