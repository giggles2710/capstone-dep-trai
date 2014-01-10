/**
 * Created by Noir on 1/9/14.
 */

var signUpCtrl = ['$scope','$http','$location','$window',function($scope, $http, $location,$window){
    $scope.default = {
        dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        months: [1,2,3,4,5,6,7,8,9,10,11,12],
        years: getAllYears()
    }

    $scope.newUser = {
        gender : 'male'
    };
    $scope.isServerError = false;

    $scope.isMatch = function(){
        if($scope.newUser.password && $scope.newUser.passwordConfirm){
            return $scope.newUser.password != $scope.newUser.passwordConfirm;
        }else{
            return false;
        }
    }

    function getAllYears(){
        var years = [];

        for(var i=new Date().getFullYear();i > new Date().getFullYear() - 110;i--){
            years.push(i);
        }

        return years;
    }

    $scope.submit = function(){
        // open dialog
        $('#myModal').modal('toggle');
        $http({
            method: 'POST',
            url:    '/signup',
            data: $.param($scope.newUser),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                // redirect to homepage
                $window.location.href = '/';
            })
            .error(function(data, status){
                // close dialog
                $('#myModal').modal('toggle');
                // display error
                $scope.isServerError = true;
                $scope.serverError = data.errors.name;
            })
    }
}]