/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

//angular.module('my9time.user').controller('userController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', function ($rootScope, $location, $scope, $http, Session, Users) {
//        $scope.global = Session;
//        $scope.myDate = new Date();
//
//        /**
//         * TrungNM - viewProfile
//         */
//        $scope.viewProfile = function ($files) {
//
//            Users.getProfile({
//                id: $scope.global.userId
//            }, function (user) {
//                //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
//                $scope.user = user;
//                $scope.user.birthday = Date.parse(user.birthday);
//
//            });
//        };
//
//
//
//    }]);

angular.module('my9time_user').controller('SigninController', ['$rootScope', '$scope', '$http', '$location', 'UserSession', function ($rootScope, $scope, $http, $location, Session) {
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
                $location.url('/profile');

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