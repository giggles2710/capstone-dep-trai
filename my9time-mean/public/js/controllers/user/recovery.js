/**
 * Created by Noir on 1/20/14.
 */

'use strict'

angular.module('my9time.user')
    .controller('RecoverPasswordController',['$scope','$http','$location','$routeParams','Users','$rootScope',function($scope, $http, $location, $routeParams, Users, $rootScope){
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

angular.module('my9time.user')
    .controller('RecoveryController',['$http','$location','$scope','$rootScope', function($http, $location, $scope,$rootScope){
        if(!$rootScope.isChecked){
            if($location.path().indexOf('login')>-1){
                // is login route
                $rootScope.pageState = "login";
                $rootScope.isChecked = true;
            }else if($location.path().indexOf('signup')>-1){
                // is signup route
                $rootScope.pageState = "register";
                $rootScope.isChecked = true;
            }else{
                // is signup route
                $rootScope.pageState = "forgot";
                $rootScope.isChecked = true;
            }
        }

        $scope.isCalling = false;
        $scope.isValid = false;
        $scope.isError = false;
        $scope.error = '';
        $scope.isSent = false;

        $scope.info = {};

        $scope.submit = function(){
            $scope.isCalling = true;
            console.log('username: ' + $scope.info.username + ' email: ' + $scope.info.email);
            $http({
                method  :   'GET',
                url     :   '/api/sendRecoveryEmail/'+$scope.info.username+'/'+$scope.info.email
            })
                .success(function(status, data){
                    // mail sent
                    $scope.isError = false;
                    $scope.error = '';
                    $scope.isCalling = false;
                    $scope.isSent = true;
                })
                .error(function(data, status){
                    // it is invalid
                    $scope.isError = true;
                    $scope.error = data;
                    $scope.isCalling = false;
                    $scope.isSent = false;
                });
        }

        $scope.jumpToLogin = function(){
            $rootScope.pageState = 'login';
        }
}])
