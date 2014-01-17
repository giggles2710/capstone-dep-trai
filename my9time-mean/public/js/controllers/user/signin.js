/**
 * Created by Noir on 1/16/14.
 */
'use strict'

angular.module('my9time.user')
    .controller('SignInController', ['$scope', '$http', '$location', '$window', 'Global', function ($scope, $http, $location, $window, Global) {
        $scope.global = Global;

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
                    $window.location.href = '/';

                })
                .error(function(data, status){
                    console.log(data.message);
                    $scope.isLoginError = true;
                    $scope.loginError = data.message;
                })
        };
    }]);