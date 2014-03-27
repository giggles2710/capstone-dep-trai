/**
 * Created by ConMeoMauDen on 14/02/2014.
 */
'use strict'
angular.module('my9time').controller('AdminController', ['$scope','$location','UserSession','Event','Users','$routeParams','$q','$http','Helper','$window','Conversation','Notifications','FriendRequest','EventRequest','HomepageSocket','MessageSocket','$translate','Modal','$timeout','EventSocket',
    function($scope , $location ,Session, Event, Users, $routeParams, $q, $http, Helper, window, Conversation, Notification, FriendRequest, EventRequest, homeSocket, messageSocket,$translate,modal,$timeout,eventSocket){
        $scope.global = Session;

        $scope.logout = function(){
            $http({
                method: 'GET',
                url: '/logout'
            })
                .success(function(data, status){
                    // success, clear service session
                    Session.userId = '';
                    Session.username = '';
                    Session.isAdmin = false;
                    // redirect to /
                    window.location.href='/';
                });
        }

        $scope.loadReportedEvent = function loadReportedEvent(){
            $scope.reportedEvents = [];
            $http({
                method: 'GET',
                url: '/api/getReportedEvent'
            })
                .success(function(data, status){
                    $scope.reportedEvents = data;
                });

        }

        $scope.loadReportedUser = function loadReportedUser(){
            $scope.reportedUsers = [];
            $http({
                method: 'GET',
                url: '/api/getReportedUser'
            })
                .success(function(data, status){
                    $scope.reportedUsers = data;
                });
        }

        $scope.ban = function(index, targetId, type){
            $http({
                method: 'PUT',
                url: '/api/ban/'+targetId+'?type='+type
            })
                .success(function(data, status){
                    if(type=='e'){
                        $scope.loadReportedEvent();
                    }else{
                        $scope.loadReportedUser();
                    }
                });
        }

        $scope.active = function(index, targetId, type){
            $http({
                method: 'PUT',
                url: '/api/active/'+targetId+'?type='+type
            })
                .success(function(data, status){
                    if(type=='e'){
                        $scope.loadReportedEvent();
                    }else{
                        $scope.loadReportedUser();
                    }
                });
        }
    }]);
