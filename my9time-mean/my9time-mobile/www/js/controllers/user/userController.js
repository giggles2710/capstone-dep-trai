/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

angular.module('my9time').controller('signinController', ['$rootScope', '$scope', '$http', '$location', 'UserSession', function ($rootScope, $scope, $http, $location, Session) {
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
                Session.isLogged = true;
                // TODO: Code lại Session Mobile
//                $rootScope.user.userId = data.id;
//                $rootScope.user.username = data.username;

                Session.username = data.username;
                Session.userId = data.id;
                Session.fullName = data.fullName;
                Session.avatar = data.avatar;
                // redirect
                $location.url('/profile');

            })
            .error(function(data, status){
                $scope.isLoginError = true;
                $scope.loginError = data.message;
            })
    }

}])

    .controller('userController', ['$rootScope', '$scope', '$http', '$location', 'UserSession', 'Users', function ($rootScope, $scope, $http, $location, Session, Users) {
    $scope.global = Session;
    $scope.session = {};

    /**
     * TrungNM - viewProfile
     */
    $scope.viewProfile = function () {


//        console.log('Root:   ' + JSON.stringify($rootScope.user.userId));

        Users.getProfile({
            id: '52f9d20adc2149801a21bbc7'
        }, function (user) {
            //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
            $scope.user = user;
            console.log(JSON.stringify(user));
            $scope.user.birthday = Date.parse(user.birthday);

        });
    };


}])
