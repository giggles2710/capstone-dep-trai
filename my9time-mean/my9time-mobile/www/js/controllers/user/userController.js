/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

angular.module('my9time.user').controller('userController', ['$rootScope', '$scope', '$routeParams', '$http', '$navigate', '$location', 'UserSession', 'Users','$timeout', function ($rootScope, $scope, $routeParams, $http, $navigate, $location, Session, Users, $timeout) {
    if(!$rootScope.isChecked){
            if($location.path().indexOf('login')>-1){
                // is login route
                $rootScope.isLogin = true;
                $rootScope.isChecked = true;
            }else{
                // is signup route
                $rootScope.isLogin = false;
                $rootScope.isChecked = true;
            }
        }

    $scope.global = Session;
    $scope.session = {};
    $scope.loginError = '';
    $scope.isLoginError = false;
    $rootScope.user = '';

    // Điều hướng trang
    $scope.jumpToRegister = function(){
        $rootScope.isLogin = false;
    }

    $scope.go = function(path){
        $navigate.go(path)
    }

    $scope.back = function () {
        $navigate.back();
    };

    $scope.openGoogle = function(){
        var ref = window.open('http://42.119.51.198:8080/', '_self', 'location=yes');
    }

    $scope.login = function(){
        console.log('User - Login - Session:   ' +  JSON.stringify($scope.session));
        var user = { username: $scope.username, password: $scope.password};
        $http({
            method: 'POST',
            url:    'http://42.119.51.198:8080/login',
            data: $.param(user),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                console.log('Dang Nhap:    ' + data);
                // TODO: Code lại Session Mobile

                Session.isLogged = true;
                Session.username = data.username;
                Session.userId = data.id;
                Session.fullName = data.fullName;
                Session.avatar = data.avatar;
                console.log('User - login - global:    ' + JSON.stringify($scope.global));
                // redirect
                $navigate.go('/homepage');

            })
            .error(function(data, status){
                $scope.isLoginError = true;
                $scope.loginError = data.message;
            })
    }
        $scope.global = Session;
        $scope.session = {};

        /**
         * TrungNM - viewProfile
         */
        $scope.viewProfile = function ($files) {
            //check creator
            // Nếu link = /profile thì ghép userID vào
            if($routeParams.id == null){
                $routeParams.id = $scope.global.userId;
            }

            if($routeParams.id == $scope.global.userId){
                $scope.isCreator = true;
            }
            // Lấy user profile
            Users.getProfile({
                id: $routeParams.id
            }, function (user) {
                $scope.user = user;
//                $scope.user.birthday = Date.parse(user.birthday);
                $scope.user.birthday = formatFullDate(new Date(user.birthday))

            });
        };




        // format date
        function formatFullDate(input){
            if(input != ""){
                var date = new Date(input);
                date.setMonth(date.getMonth());
                return  date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
            }
            else return input
        }



}])




