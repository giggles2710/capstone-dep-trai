/**
 * Created by ConMeoMauDen on 10/02/2014.
 */

// Controller của View group
angular.module('my9time.group')
    .controller('groupController', ['$rootScope', '$scope', '$location', '$http', 'UserSession', 'Users', function ($rootScope, $scope, $location, $http, Session, Users) {
        $scope.groupDetail = 'GAY';
        $scope.global = Session;

        $scope.view = function () {
            Users.query({}, function (users) {
                $scope.users = users;
            });

        };

        console.log('Group Name:   ' + $scope.groupName);
        $scope.createGroup = function () {
            Users.update({'_id': $scope.global.userId},
                {
                    $set: {
                        gender: 'VCC'
                    }
                }, function (err, response) {
                    if (err) {
                        var errorMessage = helper.displayMongooseError(err);
                        console.log(err);
                        return res.send(500, errorMessage);
                    }

                    $location.path('/groups/'+ response.group[1].id);

                }
            )
            console.log('OK');
            $location.path('/');
        }
    }]);