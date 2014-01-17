'use strict';

angular.module('my9time.system')
.controller('IndexController', ['$scope', 'UserSession', function ($scope, Session) {
    $scope.global = Session;
}]);