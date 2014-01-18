'use strict';

angular.module('my9time.system')
.controller('IndexController', ['$scope', '$http', '$location', 'UserSession', function ($scope, $http, $location, Session) {
    $scope.global = Session;

        $scope.logout = function(){
            $http({
                method: 'GET',
                url: '/logout'
            })
                .success(function(data, status){
                    // success, clear service session
                    Session.username = '';
                    Session.userId = '';
                    Session.isLogged = false;
                    // redirect to /
                    $location.path('/');
                })
        }
}]);