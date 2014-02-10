/**
 * Created by ConMeoMauDen on 10/02/2014.
 */

// Controller của View group
angular.module('my9time.group',[])
    .controller('viewGroupController', ['$rootScope','$scope', '$http', '$location', '$window', 'UserSession', function ($rootScope, $scope, $http, $location, $window, Session) {
        // css file
//        $rootScope.filepath = 'views/signin.css';

        $scope.groupDetail = null;

        $scope.view = function(){
            $http({
                method: 'GET',
                url:    '/groups/:id',
                data: $.param($scope.session),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                // Nếu thành công
                .success(function(data, status){
                    // update user in user session
                    Session.isLogged = true;
                    Session.username = data.username;
                    Session.userId = data.id;
                    // redirect
                    $location.path('/');

                })
                // Nếu thất bại
                .error(function(data, status){
//                    $scope.isLoginError = true;
//                    $scope.loginError = data.message;
                })
        };
    }]);