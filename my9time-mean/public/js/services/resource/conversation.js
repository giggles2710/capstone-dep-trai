/**
 * Created by Noir on 2/25/14.
 */

angular.module('my9time.event').factory('Conversation',['$resource',function($resource){
    return $resource('/api/conversation/:conversationId',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        },
        reply:{
            method: 'PUT',
            url: '/api/reply/:conversationId'
        }
    });
}]);
