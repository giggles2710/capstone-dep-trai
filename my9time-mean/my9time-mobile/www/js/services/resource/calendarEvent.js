
angular.module('my9time.calendar').factory('Calendar',['$resource','$rootScope', function($resource, $rootScope){
    return $resource($rootScope.LOCALHOST + '/mobile/calendar/' + localStorage.getItem("userId"),{
        id:'@_id'
    },{
        update:{
            method: 'PUT'
        },
        getCalendar:{
            method: 'POST',
            url:$rootScope.LOCALHOST + '/mobile/calendar/:id'
        }
    });
}]);