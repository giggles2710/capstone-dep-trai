/**
 * Created by Noir on 1/22/14.
 */

/**
 * Created by Noir on 1/16/14.
 */
'use strict'

angular.module('my9time.user')
    .controller('SignInController', ['$rootScope','$scope', '$http', '$location', '$window', 'UserSession','Modal', function ($rootScope, $scope, $http, $location, $window, Session, modal) {
        // check route to display correct form
        if(!$rootScope.isChecked){
            if($location.path().indexOf('login')>-1){
                // is login route
                $rootScope.pageState = "login";
                $rootScope.isChecked = true;
            }else if($location.path().indexOf('signup')>-1){
                // is signup route
                $rootScope.pageState = "register";
                $rootScope.isChecked = true;
            }else{
                // is signup route
                $rootScope.pageState = "forgot";
                $rootScope.isChecked = true;
            }
        }

        $scope.global = Session;
        $scope.session = {};
        $scope.loginError = '';
        $scope.isLoginError = false;

        $scope.oauthLogin = function(provider){
            $window.location.href = '/auth/'+provider;
        }

        $scope.jumpToRegister = function(){
            $rootScope.pageState = "register";
        }

        $scope.jumpToForgot = function(){
            $rootScope.pageState = "forgot";
        }

        $scope.login = function(){
            $http({
                method: 'POST',
                url:    '/login',
                data: $.param($scope.session),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    if(data.isAdmin){
                        // is admin
                        // redirect to admin page
                        Session.userId = data.id;
                        Session.username = data.username;
                        Session.isAdmin = true;

                        $window.location.href='/admin/home'
                    }else{
                        // update user in user session
                        Session.isLogged = true;
                        Session.username = data.username;
                        Session.userId = data.id;
                        Session.fullName = data.fullName;
                        Session.avatar = data.avatar;
                        Session.isAdmin = false;
                        // redirect
//                    $location.path('/');
                        $window.location.href = '/';
                    }
                })
                .error(function(data, status){
                    $scope.isLoginError = true;
                    $scope.loginError = data.message;
                })
        };

        $scope.openTermAndCondition = function(){
            console.log('Term and Condition');
            modal.open($scope,'/views/component/termAndCondition.html',function(res){

            })
        }
    }]);

/**
 * Created by Noir on 1/16/14.
 */

angular.module('my9time.user')
    .controller('SignUpController', ['$rootScope', '$scope', '$http', '$location', '$window', 'UserSession', 'Users', function ($rootScope, $scope, $http, $location, $window, Session, Users) {
        // check route to display correct form
        if(!$rootScope.isChecked){
            if($location.path().indexOf('login')>-1){
                // is login route
                $rootScope.pageState = "login";
                $rootScope.isChecked = true;
            }else if($location.path().indexOf('signup')>-1){
                // is signup route
                $rootScope.pageState = "register";
                $rootScope.isChecked = true;
            }else{
                // is signup route
                $rootScope.pageState = "forgot";
                $rootScope.isChecked = true;
            }
        }
        $scope.default = {
            dates: ['--',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            months: ['--',1,2,3,4,5,6,7,8,9,10,11,12],
            years: getAllYears()
        }
        $scope.newUser = {
            gender : 'male'
        };
        $scope.isServerError = false;

        $scope.isMatch = function(){
            if($scope.newUser.password && $scope.newUser.passwordConfirm){
                return $scope.newUser.password != $scope.newUser.passwordConfirm;
            }else{
                return false;
            }
        }

        $scope.jumpToLogin = function(){
            $rootScope.pageState = "login";
        }

        function getAllYears(){
            var years = ['----'];

            for(var i=new Date().getFullYear();i > new Date().getFullYear() - 110;i--){
                years.push(i);
            }

            return years;
        }

        $scope.submit = function(){
            // open dialog
            var user = new Users({
                firstName: $scope.newUser.firstName,
                lastName: $scope.newUser.lastName,
                gender: $scope.newUser.gender,
                username: $scope.newUser.username,
                email: $scope.newUser.email,
                password: $scope.newUser.password,
                date: $scope.newUser.date,
                month: $scope.newUser.month,
                year: $scope.newUser.year,
                responseCaptcha: $scope.newUser.captcha
            });
            user.$save(function(res){
                if(!res.err){
                    // update session
                    Session.isLogged = true;
                    Session.username = res.username;
                    Session.userId = res.userId;
                    Session.fullName = res.fullName;
                    Session.avatar = res.avatar;
                    // redirect to homepage
                    $window.location.href = '/';
                }else{
                    $scope.isServerError = true;
                    $scope.serverError = res.err;
                    // reset user
                    $scope.newUser = {
                        gender : 'male'
                    };
                }
            });
        }
    }]);