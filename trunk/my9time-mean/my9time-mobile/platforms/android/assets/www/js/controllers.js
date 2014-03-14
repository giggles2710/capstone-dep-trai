'use strict';

angular.module('myApp.controllers', [])
    .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location','Users', function ($scope, $rootScope, $window, $location, Users) {
        $scope.slide = '';
        $scope.text = '1';

        $scope.getProfile = function(){
            $scope.text = '2';
//            $scope.employee = Employee.get({id: '52f9d20adc2149801a21bbc7'});


        }
        $scope.change = function(){
            $scope.text = '3';
        }


        $rootScope.back = function() {
          $scope.slide = 'slide-right';
          $window.history.back();
        }
        $rootScope.go = function(path){
          $scope.slide = 'slide-left';
          $location.url(path);
        }
    }])
    .controller('SigninController', ['$rootScope', '$scope', '$http', '$location', 'UserSession', 'Users', function ($rootScope, $scope, $http, $location, Session, Users) {
        $scope.global = Session;
        $scope.session = {};




        $scope.login = function(){
            var user = { username: $scope.username, password: $scope.password};
            $http({
                method: 'POST',
                url:    'http://192.168.1.7:8080/login',
                data: $.param(user),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    console.log(data);
                    // update user in user session
                    Session.isLogged = true;
                    Session.username = data.username;
                    Session.userId = data.id;
                    Session.fullName = data.fullName;
                    Session.avatar = data.avatar;
                    // redirect
                    $location.path('/profile');

                })
                .error(function(data, status){
                    $scope.isLoginError = true;
                    $scope.loginError = data.message;
                })
//            Users.login({},{user: user}, function(user){
//                console.log
//                $scope.text = user;
//            })
        }


    }])

    .controller('EmployeeListCtrl', ['$scope', function ($scope) {
//        $scope.employees = Employee.query();
    }])
    .controller('EmployeeDetailCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
//        $scope.employee = Employee.get({employeeId: $routeParams.employeeId});
    }])
    .controller('ReportListCtrl', ['$scope', '$rout)eParams', function ($scope, $routeParams) {
//        $scope.employees = Report.query({employeeId: $routeParams.employeeId});
    }]);
