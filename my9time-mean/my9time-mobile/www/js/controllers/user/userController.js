/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

angular.module('my9time.user').controller('userController', ['$rootScope', '$scope', '$http', '$location', 'UserSession', 'Users','$timeout', function ($rootScope, $scope, $http, $location, Session, Users, $timeout) {
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


        $scope.jumpToRegister = function(){
        $rootScope.isLogin = false;
    }
    $scope.go = function(){
        console.log('Test go');
        $location.url('/profile');
    }

    $scope.login = function(){
//        console.log(JSON.stringify($scope.session));
        var user = { username: $scope.username, password: $scope.password};
        $http({
            method: 'POST',
            url:    'http://42.119.51.198:8080/login',
            data: $.param(user),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        })
            .success(function(data, status){
                console.log(data);
                // update user in user session
                // TODO: Code lại Session Mobile

                Session.isLogged = true;
                Session.username = data.username;
                Session.userId = data.id;
                Session.fullName = data.fullName;
                Session.avatar = data.avatar;
                console.log('1:    ' + JSON.stringify($scope.global));
                // redirect
                $location.url('/profile');

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
        $scope.viewProfile = function () {
            $timeout(function(){
                console.log('2:    ' + JSON.stringify($scope.global.userId));
                Users.getProfile({
                    id: $scope.global.userId
                }, function (user) {
                    //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
                    $scope.user = user;
                    $scope.user.birthday = Date.parse(user.birthday);

                });

            },1000);


        };

        $scope.test = function(){
            $location.url('/profile');

        }

}])




