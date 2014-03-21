/**
 * Created by ConMeoMauDen on 19/03/2014.
 */
angular.module('my9time.homepage').controller('homeController', ['$rootScope', '$scope', '$routeParams', '$location', '$http','Helper', 'UserSession', '$navigate', function ($rootScope, $scope,$routeParams, $location, $http, Helper, Session, $navigate) {

    $scope.isAtTop = true;
    $scope.global = Session;
    $scope.friends = [];
    $scope.posts = [];
    $scope.userId = $scope.global.userId;
    $scope.ownerId = $routeParams.userId;
    $scope.scrollIsBusy = false;
    $rootScope.showSettings = false;

    $scope.slidePage = function (path,type) {
        $navigate.go(path,type);
    };
    $scope.back = function () {
        $navigate.back();
    };
    $scope.changeSettings = function () {
        $rootScope.showSettings = true;
    };
    $scope.closeOverlay = function () {
        $rootScope.showSettings = false;
    };


    $scope.goToEvent = function(path){
        console.log('homeController - goToEvent:   ' + path);
        $navigate.go(path);
//        $navigate.go('/event/view/5327390bd5b88eac18c8e1fa');


    }

    // infinitive scrolling
    $scope.loadMore = function(){
        if($scope.scrollIsBusy) return;
        $scope.scrollIsBusy = true;
        var ids = [];
        // make the list contains all the id of posts which is displayed
        for(var i=0;i<$scope.posts.length;i++){
            ids.push($scope.posts[i]._id);
        }

        if($location.path().indexOf('timeshelf')>-1){
            // call the timeshelf
            $http({
                method:'GET',
                url:$rootScope.LOCALHOST + '/api/timeshelf/'+$scope.ownerId,
                params: {
                    ids: JSON.stringify(ids)
                }
            })
                .success(function(res){
                    console.log('Day ne:   ' + JSON.stringify(res));
                    Helper.findRightOfCurrentUser(res.events,$scope.global.userId,0,function(err, events){
                        if(err){
                            $scope.error = err;
                        }

                        for(var i=0;i<events.length;i++){
                            $scope.posts.push(events[i]);
                        }
                        // set that is not busy anymore
                        $scope.scrollIsBusy = false;
                    });
                });
        }else{
            // it's the homepage
            $http({
                method:'GET',
                url:$rootScope.LOCALHOST + '/api/homepage/',
                params: {
                    ids: JSON.stringify(ids)
                }

            })
                .success(function(res){
//                    console.log('Homepage:   ' + JSON.stringify(res));
                    Helper.findRightOfCurrentUser(res.events,$scope.global.userId,0,function(err, events){
                        if(err){
                            $scope.error = err;
                        }

                        for(var i=0;i<events.length;i++){
                            $scope.posts.push(events[i]);
                        }
                        // set that is not busy anymore
                        $scope.scrollIsBusy = false;
                    });
                });
        }
    }

    $scope.init = function(){
        console.log('init Homepage');
//        $( document ).on( "pagecreate", function() {
//            $( "body > [data-role='panel']" ).panel();
//            $( "body > [data-role='panel'] [data-role='listview']" ).listview();
//        });
//        $( document ).one( "pageshow", function() {
//            $( "body > [data-role='header']" ).toolbar();
//            $( "body > [data-role='header'] [data-role='navbar']" ).navbar();
//        });
    }


}])




