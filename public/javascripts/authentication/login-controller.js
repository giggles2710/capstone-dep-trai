/**
 * Created by Noir on 1/8/14.
 */

var loginCtrl = ['$scope','$http','$location','$window', function($scope, $http, $location, $window){
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
                console.log(data.errors.name);
                $scope.isLoginError = true;
                $scope.loginError = data.errors.name;
            })
    };

//    if(!$scope.$$phase)
//        $scope.$apply();
}];