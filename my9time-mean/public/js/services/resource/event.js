/**
 * Created by Nova on 2/10/14.
 */
angular.module('my9time.event').factory('Event',['$resource', function($resource){
    return $resource('/api/event/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        },
        addComment:{
            method: 'post',
            url:'/api/event/view/:id/addComment'
        },
        removeComment:{
            method: 'post',
            url:'/api/event/view/:id/removeComment'
        },
        cropCover:{
            method: 'post',
            url:'/api/event/view/:id/cropCover'
        }
    });
}]);

