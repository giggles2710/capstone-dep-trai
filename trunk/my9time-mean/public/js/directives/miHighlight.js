/**
 * Created by Nova on 3/20/14.
 */
angular.module('my9time')
    .directive('miLike',['$http', MiHighlight]);

function MiHighlight($http){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/highlightButton.html',
        scope:{
            eventID :'@event',
            userID : '@user',
            visitorID : '@visitor'
        },
        controller:function($scope){
            $scope.isLoading = true;
            $scope.display = false;
            $scope.button = {}
            $scope.communicate = function(){
                if($scope.status=='Highlight'){
                    // then unHighlight
                    unHighlight();
                }else if($scope.status == 'unHighlight'){
                    // then highlight
                    highlight();
                }
            }

            this.updateStatus = updateStatus;

            function updateStatus(data){
                if(data=='Highlight'){
                    $scope.button.name = 'unHighlight';
                    $scope.button.status = 'fa fa-heart';
                }else if(data == 'unHighlight'){
                    $scope.button.name = 'Highlight';
                    $scope.button.status = 'fa fa-heart-o';

                }
                // hide loading button
                $scope.isLoading = false;
            }

            function highlight(){
                // show loading button
                $scope.isLoading = true;
                // call like now
                $http({
                    method:'PUT',
                    url:'/api/highlight',
                    data: $.param({eventID: $scope.eventID}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'Highlight'){
                            // change button to confirm request
                            $scope.likeStatus ="Highlight";
                            updateStatus('Highlight');
                        }
                    });
            }
            function unHighlight(){
                // show loading button
                $scope.isLoading = true;
                // call like now
                $http({
                    method:'PUT',
                    url:'/api/unLike',
                    data: $.param({eventID: $scope.eventID}),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(data, status){
                        if(data == 'unHighlight'){
                            // change button to confirm request
                            $scope.likeStatus ='unHighlight'
                            updateStatus('unHighlight');
                        }
                    });
            }
        }
        ,link: function(scope, ele, attrs, ctrl){
            if(attrs.user == attrs.visitor){
                scope.display = true;
            $http({
                method:'POST',
                url:'/api/isHighlight',
                params: {eventID: attrs.event},
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(res){
                    console.log('get status : ' + res);
                    if(res.isError == 'true'){
                        scope.display = false;
                    }
                    else{
                        if(res.isHighlight == 'false'){
                            scope.status = 'Highlight';
                            ctrl.updateStatus('Highlight');
                        }
                        if(res.isHighlight == 'true'){
                            scope.status = 'unHighlight';
                            ctrl.updateStatus('unHighlight');
                        }
                    }

                })
                .error(function(res){
                    console.log('error: ' + res);
                });
            }
        }
    }
};