/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

var app = angular.module('my9time.user')
    .controller('userController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', '$fileUploader', function ($rootScope, $location, $scope, $http, Session, Users, $fileUploader) {
        $scope.global = Session;
        $scope.avatar = '../img/avatar/'+ $scope.global.userId + '.png';
        $scope.myDate = new Date();


        /**
         * TrungNM - viewProfile
         */
        $scope.viewProfile = function ($files) {

            Users.getProfile({
                id: $scope.global.userId
            }, function (user) {
                //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
                $scope.user = user;
                $scope.user.birthday = Date.parse(user.birthday);

            });
        };


        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: '../api/users/uploadAvatar',
            formData: [
                { key: 'value' }
            ],
            filters: [
                function (item) {                    // first user filter
                    console.info('filter1');
                    return true;
                }
            ]
        });

        // TODO: Code khi up thành công và load lại
        uploader.bind('completeall', function (event, items) {
        });
        /**
         * TrungNM - Upload Avatar
         */
        $scope.uploadAvatar = function ($files) {



        }

        /**
         * TrungNM - viewProfile
         */
        $scope.updateProfile = function () {
            var user = $scope.user;
            user.$update({id: $scope.global.userId}, function (user) {
                $location.path('profile');
            })
        }


    }]);

//app.config(function(ngQuickDateDefaultsProvider) {
//    return ngQuickDateDefaultsProvider.set({
//    });
//});