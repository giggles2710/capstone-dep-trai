/**
 * Created by Noir on 2/25/14.
 */

angular.module('my9time.event').factory('Conversation',['$resource',function($resource){
    return $resource('/api/conversation/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        },
        reply:{
            method: 'PUT',
            url:    '/api/reply/:conversationId'
        },
        getChatLog:{
            method: 'PUT',
            url:    '/api/getChatLog/:userId'
        },
        getRecentChat:{
            method: 'GET',
            url:    '/api/getRecentChat/:userId'
        }
    });
}]);
