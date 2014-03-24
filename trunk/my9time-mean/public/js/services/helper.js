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
            },
            findRightOfCurrentUser: function findRightOfCurrentUser(events,userId,count,cb){
                if(!userId){
                    return cb('User is no longer exists',null);
                }
                if(count==events.length){
                    return cb(null, events);
                }
                if(events.length == 0){
                    return cb(null, []);
                }
                var event = events[count];
                var right = 'none';
                // try to check right based on privacy
                // -- private: only the creator can see
                // -- group: people in the group can see but only the person who has the invite right can invite more
                // -- open community: it's open, everyone can both join and invite.
                // -- close community: everyone can see. However, only the person who has the invite right can invite more
                // the person who want to join have to be confirmed by the creator.
                if(event.creator.userID == userId){
                    right = 'invite';
                }else{
                    switch(event.privacy){
                        case 'g':
                            for(var i=0;i<event.user.length;i++){
                                var joiner = event.user[i];
                                if(joiner.userID == userId){
                                    // this user is invited
                                    // -- he can't join this event
                                    // check can he invite more?
                                    if(joiner.inviteRight){
                                        right = 'invite';
                                    }
                                }
                            }
                            break;
                        case 'o':
                            for(var i=0;i<event.user.length;i++){
                                var joiner = event.user[i];
                                if(joiner.userID == userId){
                                    // this user is invited
                                    // -- he can invite more
                                    right = 'invite';
                                }
                            }
                            if(right.indexOf('none')>-1){
                                // this user is not invited
                                // -- he can join this event
                                right = 'join';
                            }
                            break;
                        case 'c':
                            if(event.user.length!==0){
                                for(var i=0;i<event.user.length;i++){
                                    var joiner = event.user[i];
                                    if(joiner.userID == userId && joiner.status=='confirmed'){
                                        // this user is invited
                                        // -- he can't join this event
                                        // check can he invite more?
                                        if(joiner.inviteRight){
                                            right = 'invite';
                                        }
                                    }
                                }
                            }
                            if(right.indexOf('none')>-1){
                                // this user is not invited
                                // -- he can join this event
                                right = 'join';
                            }
                            break;
                        case 'p':
                            if(event.creator.userID == userId){
                                // he is owner
                                // so he can invite more
                                right = 'invite';
                            }
                            break;
                    };
                }
                // embedded right of this user to this event
                //events[count].right = right;
                events[count]["right"] = right;
                // incremented count
                count++;
                // call recursive
                findRightOfCurrentUser(events,userId,count,cb);
            }
        }
    }]);
