/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

angular.module('my9time.user')
    .controller('userController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', function ($rootScope,$location,  $scope, $http, Session, Users) {
        $scope.global = Session;
        $scope.avatar = '../img/avatar/hoanhtrang.png'

        /**
         * TrungNM - viewProfile
         */
        $scope.viewProfile = function () {
            Users.getProfile({
                id: $scope.global.userId
            }, function(user) {
                //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
                $scope.user = user;
            });
        };

        /**
         * TrungNM - viewProfile
         */
        $scope.uploadAvatar = function () {
            Users.uploadAvatar({id: $scope.global.userId}, function(user){
                $location.path('profile');
            })
        }

        /**
         * TrungNM - viewProfile
         */
        $scope.updateProfile = function () {
            var user = $scope.user;
            user.$update({id: $scope.global.userId}, function(user){
                $location.path('profile');
            })
        }
    }]);