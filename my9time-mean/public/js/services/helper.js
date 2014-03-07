/**
 * Created by Nova on 2/17/14.
 */

angular.module('my9time.system')
    .factory('Helper',['$http', function($http){
        return {
            formatDate:function(date){
                var dd = ("0" + date.getDate()).slice(-2);
                var mm = ("0" + (date.getMonth() + 1)).slice(-2);
                var yy = date.getFullYear();
                var today = yy+'-'+mm+'-'+dd;
                return today;
            },
            apply:function(scope){
                if(!scope.$$phase) {
                    //$digest or $apply
                    scope.$apply();
                }
            },
            getRecentChatters:function(userId, cb){
                $http({
                    method:'GET',
                    url:'/api/getRecentChatters/'+userId,
                    headers : {'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(res){
                        return cb(null, res);
                    })
                    .error(function(res){
                        return cb(res, null);
                    });
            },
            getRecentConversation:function(userId, cb){
                $http({
                    method:'GET',
                    url:'/api/getRecentConversation/'+userId,
                    headers : {'Content-Type':'application/x-www-form-urlencoded'}
                })
                    .success(function(res){
                        return cb(null, res);
                    })
                    .error(function(res){
                        return cb(res, null);
                    });
            },
            getAllFriends:function(userId, cb){
                $http({
                    method:'GET',
                    url:'/api/getAllFriends/'+userId
                })
                    .success(function(res){
                        return cb(null, res);
                    })
                    .error(function(res){
                        return cb(res, null);
                    });
            }
        }
    }]);
