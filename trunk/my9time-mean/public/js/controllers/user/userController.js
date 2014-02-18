/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

angular.module('my9time.user')
    .controller('userController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', '$upload', function ($rootScope, $location, $scope, $http, Session, Users, $upload) {
        $scope.global = Session;
        $scope.avatar = '../img/avatar/hoanhtrang.png'

        /**
         * TrungNM - viewProfile
         */
        $scope.viewProfile = function () {
            Users.getProfile({
                id: $scope.global.userId
            }, function (user) {
                //TODO: coi lại cách hiển thị ( Fullname, birthday ... )
                $scope.user = user;
                $scope.user.birthday = Date.parse(user.birthday);

            });
        };

        /**
         * TrungNM - Upload Avatar
         */
        $scope.uploadAvatar = function () {
            console.log('Avatar:    ' + $scope.userAvatar);
            Users.uploadAvatarResource({},{userAvatar: $scope.userAvatar},  function(user){
                $scope.user = user;
                $location.path('profile');
            })


        }

        $scope.onFileSelect = function ($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: 'api/users/uploadAvatar', //upload.php script, node.js route, or servlet url
                    // method: POST or PUT,
                    // headers: {'headerKey': 'headerValue'},
                    // withCredentials: true,
                    data: {myObj: $scope.myModelObj},
                    file: file
                    // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
                }).progress(function (evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                    });
                //.error(...)
                //.then(success, error, progress);
            }
        };

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