/**
 * Created by ConMeoMauDen on 16/02/2014.
 */

var app = angular.module('my9time.user')
    .controller('userController', ['$rootScope', '$location', '$scope', '$http', 'UserSession', 'Users', '$fileUploader', 'Modal', '$log', '$route', '$compile', '$window', '$timeout','Modal','$routeParams', function ($rootScope, $location, $scope, $http, Session, Users, $fileUploader, $modal, $log, $route, $compile, $window, $timeout, modal,$routeParams) {
        $scope.global = Session;
        $scope.myDate = new Date();
        $scope.tmpCords = '';
        $scope.default = {
            dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            years: getAllYears()
        };
        $scope.avatarCropTmp = '';
        $scope.flagAvatar = 1;
        $scope.user = '';
        $scope.change = 1;
        $scope.friendList = [];
        $scope.isProfileError = '';
        $scope.profileError = '';
        $scope.isCreator = false;


        function getAllYears() {
            var years = [];

            for (var i = new Date().getFullYear(); i > new Date().getFullYear() - 110; i--) {
                years.push(i);
            }

            return years;
        }

        //NghiaNV
        // format date
        function formatFullDate(input){
            if(input != ""){
                var date = new Date(input);
                date.setMonth(date.getMonth());
                return  date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
            }
            else return input
        }

        //NghiaNV
        // get all friend info
//        function getFriendInfo(){
//            $http({
//                method: 'POST',
//                url:    '/api/getFriendInfo',
//                data: $.param({
//                    userID: $routeParams.id
//                }),
//                headers:{'Content-Type':'application/x-www-form-urlencoded'}
//            })
//                .success(function(data, status){
//                    $scope.friendList = data;
//
//                })
//                .error(function(err){
//                    $scope.isProfileError= true;
//                    $scope.profileError= err;
//                })
//        }


        $scope.test = function () {
            alert('you have scrolled');
        }

        /**
         * TrungNM - viewProfile
         * NghiaNV updated
         */
        $scope.viewProfile = function () {
            $http({
                method: 'POST',
                url:    '/api/getFriendInfo',
                data: $.param({
                    userID: $routeParams.id
                }),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    $scope.friendList = data;

                })
                .error(function(err){
                    $scope.isProfileError= true;
                    $scope.profileError= err;
                })

            //check creator
            if($routeParams.id == $scope.global.userId){
                $scope.isCreator = true;
            }

            Users.getProfile({
                id: $routeParams.id
            }, function (user) {
                $scope.user = user;
//                $scope.user.birthday = Date.parse(user.birthday);
                $scope.user.birthday = formatFullDate(new Date(user.birthday))

            });
        };

        /**
         * TrungNM - viewProfile
         */
        $scope.getProfile = function(){

        }

//        /**
//         * TrungNM - Update Profile
//         */
//        $scope.updateProfile = function () {
//            var user = $scope.user;
//            user.$update({id: $routeParams.id}, function (user) {
//                $scope.user = user;
//            })
//        }

        // update profile
        $scope.updateProfile= function(){
            $http({
                method: 'PUT',
                url:    '/api/user/editProfile',
                data: $.param({
                    userID: $routeParams.id,
                    location: $scope.user.location,
                    occupation:$scope.user.occupation,
                    workplace:$scope.user.workplace,
                    studyPlace:$scope.user.studyPlace,
                    showBirthday:$scope.user.showBirthday,
                    aboutMe:$scope.user.aboutMe
                }),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    // update $scope
                    $scope.user.location=data.location;
                    $scope.user.occupation =data.occupation;
                    $scope.user.workplace = data.workplace;
                    $scope.user.studyPlace = data.studyPlace;
                    $scope.user.showBirthday = data.showBirthday;
                    $scope.user.aboutMe = data.aboutMe;
                    $('edit-profile-modal').modal('toggle');
                    // clear the old modal
                    $('edit-profile-modal').remove();
                    // clear the body
                    $('body').removeClass('modal-open');
                    // clear the background
                    $('div.modal-backdrop.fade.in').remove();
                })
                .error(function(err){
                    $scope.isProfileError= true;
                    $scope.profileError= err;
                })
        };


        // open Profile Popup
        $scope.openEditProfilePopup = function(){
            modal.open($scope,'/views/component/editProfilePopup.html',function(res){
                //what's next ?
            });
        }

        // Tạo biến upload Avatar
        var avatarUpload = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: '../api/users/uploadAvatar',
            formData: [
                { key: 'value' }
            ]
        });

        // Sau khi add file thành công
        avatarUpload.bind('afteraddingall', function (event, items) {
            $('#avatar-button').click();
        });

        // Sau khi upload thành công file Avatar
        avatarUpload.bind('completeall', function (event, items) {
            modal.open($scope,'/views/component/cropAvatarModal.html',function(res){
                console.log('Sau khi modal:    ' + JSON.stringify(res));
            });


        });

        /**
         * TrungNM - Crop Avatar
         */
        $scope.selected = function () {
            Users.cropAvatar({}, {selected: $scope.tmpCords}, function (err) {
                $('#crop-avatar-modal').modal('toggle');
                $timeout(function(){$route.reload();},1000);

            })

        };


        /**
         * TrungNM - Upload Avatar
         */
        $scope.uploadAvatar = function () {
            $('#upload-avatar').click();
        }

        $scope.change = function (){
            console.log('Change');
        }




    }]);