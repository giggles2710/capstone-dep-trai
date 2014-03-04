/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

var app = angular.module('my9time.user')
    .controller('userController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', '$fileUploader', function ($rootScope, $location, $scope, $http, Session, Users, $fileUploader) {
        $scope.global = Session;
        $scope.myDate = new Date();
        $scope.default = {
            dates: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            months: [1,2,3,4,5,6,7,8,9,10,11,12],
            years: getAllYears()
        }
        function getAllYears(){
            var years = [];

            for(var i=new Date().getFullYear();i > new Date().getFullYear() - 110;i--){
                years.push(i);
            }

            return years;
        }


        $scope.test = function(){
            alert('you have scrolled');
        }

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

        /**
         * TrungNM - Update Profile
         */
        $scope.updateProfile = function () {
            var user = $scope.user;
            user.$update({id: $scope.global.userId}, function (user) {
                $scope.user = user;
            })
        }

        // Upload file
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
            console.log(items);
        });
        /**
         * TrungNM - Upload Avatar
         */
        $scope.uploadAvatar = function ($files) {

        }

        $scope.$on("cropme:done", function(e, blob) {
            console.log(blob);

            var xhr = new XMLHttpRequest;

            xhr.setRequestHeader("Content-Type", blob.type);
            xhr.onreadystatechange = function(e) {
                if (this.readyState === 4 && this.status === 200) {
                    return console.log("done");
                } else if (this.readyState === 4 && this.status !== 200) {
                    return console.log("failed");
                }
            };
            xhr.open("POST", '../api/users/uploadAvatar', true);
            xhr.send(blob);


        });



    }]);