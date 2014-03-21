
angular.module('my9time.event').factory('Event',['$resource', '$rootScope', function($resource, $rootScope){
    return $resource($rootScope.LOCALHOST + '/api/event/:id',{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        },
        addComment:{
            method: 'post',
            url:$rootScope.LOCALHOST + '/api//event/view/:id/addComment'
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

