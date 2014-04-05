/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

angular.module('my9time.user').controller('userController', ['$rootScope', '$window', '$state', '$stateParams', '$scope', '$http', '$location', 'UserSession', 'Users','$timeout', function ($rootScope,$window, $state, $stateParams, $scope, $http, $location, Session, Users, $timeout) {
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

    $scope.login = function(){
        console.log('Root isLogged 1:   ');

        console.log('Root isLogged 1:   ' + $rootScope.isLogged);
        if (Session.isLogged == 'true'){
            // chuyen huong qua homepage
            console.log('Login roi ma !');
            $state.go('home');
        } else {
            console.log('Chua Login');
            var user = {username: $scope.username, password: $scope.password};

            $http({
                method: 'POST',
                url:    $rootScope.LOCALHOST + '/login',
                data: $.param(user),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    if(data.isAdmin){
                        // is admin
                        // redirect to admin page
                        Session.userId = data.id;
                        Session.username = data.username;
                        Session.isAdmin = true;
                    }else{
                        console.log('Data:   ' + JSON.stringify(data) );
                        $rootScope.isLogged = true;
                        localStorage.setItem("userId", data.id);
                        localStorage.setItem("username", data.username);
                        localStorage.setItem("isLogged", true);
                        localStorage.setItem("fullName", data.fullName);
                        localStorage.setItem("isAdmin", false);
                        localStorage.setItem("avatar", data.avatar);
                        $window.location.href = '/';

//                        $state.go('home');

                    }
                })
                .error(function(data, status){
                    console.log('Login Error');
                    $scope.isLoginError = true;
                    $scope.loginError = data.message;
                })

        }

    };

    $scope.logout = function(){
        $http({
            method: 'GET',
            url: $rootScope.LOCALHOST + '/logout'
        })
            .success(function(data, status){
                // success, clear service session
                localStorage.setItem("userId", '');
                localStorage.setItem("username", '');
                localStorage.setItem("isLogged", false);
                localStorage.setItem("fullName", '');
                localStorage.setItem("isAdmin", false);
                localStorage.setItem("avatar", '');
                $window.location.href = '/';
            });
    }


        /**
         * TrungNM - viewProfile
         */
        $scope.viewProfile = function () {
            if($stateParams.id == null){
                $stateParams.id = $scope.global.userId;
            }4
            if($stateParams.id == $scope.global.userId){
                $scope.isCreator = true;
            }
            // Lấy user profile
            Users.getProfile({
                id: $stateParams.id
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




