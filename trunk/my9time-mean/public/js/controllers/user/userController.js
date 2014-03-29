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
        $scope.highlightList =[]
        $scope.isProfileError = '';
        $scope.profileError = '';
        $scope.isCreator = false;
        $scope.hideEmail = '';
        $scope.isNullProfile = '';



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
        // hide email
        function setCharAt(str) {
            var addValue = '';
            for(var i = 3 ; i < str.length-4 ; i++){
                addValue = addValue.concat('*');
            }
            return str.substr(0,3)+ addValue + str.substr(str.length-4);
        }


        //NghiaNV
        // check IsNullProfile and banUser
        function checkIsNullProfile(){
            $http({
                method: 'POST',
                url:    '/api/checkIsNullProfile',
                data: $.param({
                    userID: $routeParams.id
                }),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data){
                    if(data == 'true'){
                        $scope.isNullProfile = true;
                        console.log("Is Null Profile " + $scope.isNullProfile)
//                        $location.path('/404');
                        $window.location.href = '/404';
                    }
                    else if ( data == 'false'){
                        $scope.isNullProfile = false;
                    }
                })
                .error(function(err){
                    $scope.isProfileError= true;
                    $scope.profileError= err;
                })
        }


        //NghiaNV
        // get friendList
        function getFriendList (){
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
        }

        //NghiaNV
        //get HighlightList
        function getHighlightList(){
            $http({
                method: 'POST',
                url:    '/api/getHighlightList',
                data: $.param({
                    userID: $routeParams.id
                }),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    $scope.highlightList = data;

                })
                .error(function(err){
                    $scope.isProfileError= true;
                    $scope.profileError= err;
                })
        }



        /**
         * TrungNM - viewProfile
         * NghiaNV updated
         */
        $scope.viewProfile = function () {
            checkIsNullProfile();
            if($scope.isNullProfile != true){

            // get friendList
            getFriendList();

            // get Highlight List
            getHighlightList();

            //check creator
            if($routeParams.id == $scope.global.userId){
                $scope.isCreator = true;
            }

            //get current Info
            Users.getProfile({
                id: $routeParams.id
            }, function (user) {
                $scope.user = user;
//                $scope.user.birthday = Date.parse(user.birthday);
                $scope.user.birthday = formatFullDate(new Date(user.birthday));
//                $scope.hideEmail = user.email;
                $scope.hideEmail = setCharAt(user.email);

            });
        };

        // trick to update view after submit modal
//        $scope.a = function(){
//            $scope.user = $scope.$parent.user;
//        }

        /**
         * NghiaNV - getProfile
         */
        $scope.getProfile = function(){
            //check creator
            if($routeParams.id == $scope.global.userId){
                $scope.isCreator = true;
            }

            //get current Info
            Users.getProfile({
                id: $routeParams.id
            }, function (user) {
                $scope.user = user;
//                $scope.user.birthday = Date.parse(user.birthday);
                $scope.user.birthday = formatFullDate(new Date(user.birthday));
//                $scope.hideEmail = user.email;
                $scope.hideEmail = setCharAt(user.email);

            });
        }
        }

        /**
         * NghiaNV - returnProfile
         */
        $scope.returnCurValue = function(){
            //get current Info
            $http({
                method: 'GET',
                url:    '/api/getCurProfile',
                params: {userID: $routeParams.id},
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data){
                $scope.$parent.user.location=data.location;
                $scope.$parent.user.occupation =data.occupation;
                $scope.$parent.user.workplace = data.workplace;
                $scope.$parent.user.studyPlace = data.studyPlace;
                $scope.$parent.user.showBirthday = data.showBirthday;
                $scope.$parent.user.aboutMe = data.aboutMe;

                modal.close();

            });
        }

        /**
         * NghiaNV - Update Profile
         */
        $scope.updateProfile= function(){
            // get all friend of cur User
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
                .success(function(data){
                    // update $scope
                    $scope.$parent.user.location=data.location;
                    $scope.$parent.user.occupation =data.occupation;
                    $scope.$parent.user.workplace = data.workplace;
                    $scope.$parent.user.studyPlace = data.studyPlace;
                    $scope.$parent.user.showBirthday = data.showBirthday;
                    $scope.$parent.user.aboutMe = data.aboutMe;

                    modal.close();
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
                $http.get('/js/locationLibrary.json').success(function(data){
                    $('input.token-input').tokenInput(
                        data,
                        {
                            theme:'facebook',
                            hintText:"Type in a location",
                            noResultsText: "No location is found.",
                            tokenValue:'name',
                            prePopulate: [{name: $scope.user.location }]
                        }
                    );
                    $(".token-input-dropdown-facebook").css("z-index","9999");
                });
                console.log('open');
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