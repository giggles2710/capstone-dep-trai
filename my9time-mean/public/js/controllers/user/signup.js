/**
 * Created by Noir on 1/16/14.
 */
'use strict'

angular.module('my9time.user')
    .controller('SignUpController', ['$scope', '$http', '$location', '$window', 'UserSession', 'Users', function ($scope, $http, $location, $window, Session, Users) {
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

            var user = new Users({
                gender: $scope.newUser.gender,
                username: $scope.newUser.username,
                email: $scope.newUser.email,
                password: $scope.newUser.password,
                date: $scope.newUser.date,
                month: $scope.newUser.month,
                year: $scope.newUser.year
            });

            user.$save(function(res){
                // update session
                Session.isLogged = true;
                Session.username = res.username;
                Session.userId = res.userId;
                // redirect to homepage
                $location.path('/');
            });
        }
    }]);