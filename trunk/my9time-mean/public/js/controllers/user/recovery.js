/**
 * Created by Noir on 1/20/14.
 */

'use strict'

angular.module('my9time.user').controller('RecoverPasswordController',['$scope','$http','$location','$routeParams','Users',function($scope, $http, $location, $routeParams, Users){
    $scope.tokenError = '';
    $scope.invalidToken = false;
    $scope.isError = false;
    $scope.error = '';
    $scope.isChecking = true;
    $scope.input = {};
    $scope.passwordReseted = false;

    $scope.isMatch = function(){
        if($scope.input){
            if($scope.input.password && $scope.input.passwordConfirm){
                return $scope.input.password != $scope.input.passwordConfirm;
            }else{
                return false;
            }
        }
    }
    // first of all, check token
    checkToken($routeParams.token);
    // reset password
    $scope.resetPassword = function(){
        Users.changePassword({id:$scope.userId},{password:$scope.input.password, token:$routeParams.token}, function(res){
            // announces that it's changed
            $scope.passwordReseted = true;
        });
    }

    function checkToken(token){
        $http({
            method: 'GET',
            url:'/api/checkRecoveryToken/'+token
        })
            .success(function(data, status){
                // success, show change password form
                $scope.invalidToken = false;
                $scope.isCalling = false;

                $scope.userId = data.userId;
            })
            .error(function(data, status){
                // error, display error section
                $scope.invalidToken = true;
                $scope.tokenError = data;
                $scope.isCalling = false;
            });
    }
}]);

angular.module('my9time.user').controller('RecoveryController',['$http','$location','$scope', function($http, $location, $scope){
    $scope.isCalling = false;
    $scope.isValid = false;
    $scope.isError = false;
    $scope.onStep = 0;
    $scope.error = '';

    $scope.info = {};

    $scope.submitUsername = function(){
        $scope.isCalling = true;
        var username = $scope.info.username;
        $http({
            method  :   'POST',
            url     :   '/api/checkUnique',
            data    :   $.param({target: $scope.info.username,type: 'username'}),
            headers :   {'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // it doesn't not exist
                $scope.isError = true;
                $scope.error = 'Wrong username. Please try again.';
                $scope.isCalling = false;
                $scope.isValid = false;
                $scope.info.username = username;
            })
            .error(function(data, status){
                // it existed
                $scope.isError = false;
                $scope.error = '';
                $scope.isCalling = false;
                $scope.isValid = true;
                $scope.onStep = 1;
            });
    }

    $scope.submitEmail = function(){
        $scope.isCalling = true;
        console.log('username: ' + $scope.info.username + ' email: ' + $scope.info.email);
        $http({
            method  :   'GET',
            url     :   '/api/sendRecoveryEmail/'+$scope.info.username+'/'+$scope.info.email
        })
            .success(function(status, data){
                // mail sent
                $scope.onStep = 2;
                $scope.isError = false;
                $scope.error = '';
                $scope.isCalling = false;
            })
            .error(function(data, status){
                // it is invalid
                $scope.isError = true;
                $scope.error = data;
                $scope.isCalling = false;
            });
    }

    $scope.back = function(){
        if($scope.onStep == 1){
            --$scope.onStep;
        }
    }

    $scope.forward = function(){
        if($scope.onStep == 0){
            $scope.onStep++;
        }
    }
}])
