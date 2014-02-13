/**
 * Created by ConMeoMauDen on 11/02/2014.
 */
// Controller của View all User
angular.module('my9time.user')
    .controller('viewAllUserController', ['$rootScope','$scope', '$http','UserSession', 'Users', function ($rootScope, $scope, $http, Session, Users) {

        $scope.view = function() {
            Users.query({}, function(users){
                $scope.users = users;
            });
        };
    }]);