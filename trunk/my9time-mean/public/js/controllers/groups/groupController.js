/**
 * Created by ConMeoMauDen on 10/02/2014.
 */

// Controller của View group
angular.module('my9time.group')

    .controller('groupController', ['$rootScope','$scope', '$http','UserSession', 'Users', 'Groups', function ($rootScope, $scope, $http, Session, Users, Groups) {
        $scope.groupDetail = 'GAY';

        $scope.view = function() {
            Users.query({}, function(users){
                $scope.users = users;
            });

        };
    }]);