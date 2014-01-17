/**
 * Created by Noir on 1/16/14.
 */
'use strict'

angular.module('my9time.user')
    .controller('SignInController', ['$scope', '$http', '$location', '$window', 'UserSession', function ($scope, $http, $location, $window, Session) {
        $scope.global = Session;

        $scope.session = {};
        $scope.loginError = '';
        $scope.isLoginError = false;

        $scope.login = function(){
            $http({
                method: 'POST',
                url:    '/login',
                data: $.param($scope.session),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    // update user in user session
//                    Session.isLogged = true;
//                    Session.username = data.username;
//                    Session.userId = data.id;
                    // redirect
                    $location.path('/');

                })
                .error(function(data, status){
                    $scope.isLoginError = true;
                    $scope.loginError = data.message;
                })
        };
    }]);