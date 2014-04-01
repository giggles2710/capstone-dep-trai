/**
 * Created by Noir on 2/14/14.
 */
angular.module('my9time.event').controller('HomepageController', ['$scope','$location','UserSession','Event','Users','$routeParams','$q','$http','Helper','$window','Conversation','Notifications','FriendRequest','EventRequest','HomepageSocket','MessageSocket','$translate','Modal','$timeout','EventSocket',
    function($scope , $location ,Session, Event, Users, $routeParams, $q, $http, Helper, window, Conversation, Notification, FriendRequest, EventRequest, homeSocket, messageSocket,$translate,modal,$timeout,eventSocket){
        $(window).on('scroll',function() {
            if ($(this).scrollTop() > $("#tdl-spmenu-s2").offset().top) {
                $("#tdl-spmenu-s2").stop().animate({
                    marginTop: $(this).scrollTop() - $("#tdl-spmenu-s2").offset().top + 100
                });
            } else {
                $("#tdl-spmenu-s2").stop().animate({
                    marginTop: 20
                });
            }
        });
        // make to-do window follows when scroll
        var elems = document.getElementsByTagName("input"), i;
        for (i in elems) {
            if (elems[i].type == "checkbox") {
                if (elems[i].checked) //alert(this.id + " is checked");
                //if (elems[i].checked)
                    $("label[for=" + elems[i].id + "]").css("text-decoration", "line-through");
                else $("label[for=" + elems[i].id + "]").css("text-decoration", "none");

                $("#" + elems[i].id).change(function () {
                    if ($(this).is(':checked')) //alert(this.id + " is checked");
                    //if (elems[i].checked)
                        $("label[for=" + this.id + "]").css("text-decoration", "line-through");
                    else $("label[for=" + this.id + "]").css("text-decoration", "none");
                    //alert(elems[i].id + " is not checked");
                });
            }
        }

        $scope.openTodo = function(){
            if($('#tdl-spmenu-s2').hasClass('tdl-spmenu-open')){
                $('#tdl-spmenu-s2').removeClass('tdl-spmenu-open');
            }else{
                $('#tdl-spmenu-s2').addClass('tdl-spmenu-open');
            }
        }

        // Created by Nam
        // To-do
        // =================================================================================================================
        var elems = document.getElementsByTagName("input"), i;
        for (i in elems) {
            if (elems[i].type == "checkbox") {

                if (elems[i].checked) //alert(this.id + " is checked");
                //if (elems[i].checked)
                    $("label[for=" + elems[i].id + "]").css("text-decoration", "line-through");
                else $("label[for=" + elems[i].id + "]").css("text-decoration", "none");

                $("#" + elems[i].id).change(function () {
                    if ($(this).is(':checked')) //alert(this.id + " is checked");
                    //if (elems[i].checked)
                        $("label[for=" + this.id + "]").css("text-decoration", "line-through");
                    else $("label[for=" + this.id + "]").css("text-decoration", "none");
                    //alert(elems[i].id + " is not checked");
                });
            }
        }
        // =================================================================================================================
        // ANGULAR

        $scope.isAtTop = true;
        $scope.global = Session;
        $scope.friends = [];
        $scope.posts = [];
        $scope.userId = $scope.global.userId;
        $scope.ownerId = $routeParams.userId;
        $scope.scrollIsBusy = false;
        // init notification
        $scope.notificationUnreadCount = 0;
        $scope.friendRequestUnreadCount = 0;
        $scope.eventRequestUnreadCount = 0;
        $scope.messageUnreadCount = 0;

        // Language
        $scope.language = "";
        // recent Event
        $scope.recentEvent = [];
        $scope.curPostID = '';

        // ====================================================================================================================================
        // HOMEPAGE n TIMESHELF

        $scope.initialize = function(){
            //set language
            $http({
                method:'GET',
                url:'/api/users/getLanguage'
            })
                .success(function(res){
                    $translate.use(res.language);
                    // process route
                    if($location.path().indexOf('homepage')<0){
                        // it's the timeshelf
                        $scope.ownerId = $routeParams.userId; // owner id for add friend
                        if(!$scope.ownerId){
                            // temporary profile init
                            $scope.ownerId = $scope.global.userId;
                        }
                    }
                    // register to every post that user need to be noticed
                    $http({
                        method: 'GET',
                        url:    '/api/getEventIdsForNoti'
                    })
                        .success(function(res){
                            // register now
                            eventSocket.emit('join',{ids:res.ids});
                        });
                });
        }

        // Get 5 recent events
        //NghiaNV-23/3/2014
        $scope.getRecentEvent = function(){
            $http({
                method:'POST',
                url:'/api/getRecentEvent',
                data: $.param({
                    userID: $scope.global.userId}),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(res){
                    // seperate some common attributes from user to use easier
                    if(res.error){
                        $scope.error = res.error;
                    }else{
                        $scope.recentEvent = res;
                    }
                });
        }


//        =============================================================================================================================================
//        POPUP CONFIRM
//        NghiaNV - 27/3/2014

        $scope.openConfirmHidePopup = function(a){
            $scope.curPostID =a;
            //console.log("CurPost: "+ a)
            modal.open($scope,'/views/component/confirmHidePopup.html',function(res){
                //what's next ?
            });
        }


//        //Hide event
//        //NghiaNV 25/3/2014
        $scope.hideEvent = function(a){
            console.log("curPostID :" + a);
            $('#post-'+a).hide();
            modal.close();
            $http({
                method:'PUT',
                url:'/api/hideEvent',
                data: $.param({
                    eventId: a}),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(res){
                    if(res.error){
                        $scope.error = res.error;
                    }
                });
        }


        $scope.initTimeshelfProfile = function(){
            // call the timeshelf
            $http({
                method:'GET',
                url:'/api/getTimeshelfProfile/'+$scope.ownerId
            })
                .success(function(res){
                    // seperate some common attributes from user to use easier
                    if(res.error){
                        $scope.error = res.error;
                    }else{
                        // find right to report this user as violator
                        Helper.findRightToReportUser(res,$scope.global.userId,function(err,userRighted){
                            $scope.ownerMin = userRighted;
                        });
                    }
                });
        }

        // =============================================================================================================================================
        // Nghianv - Set Language
        $scope.setLang = function(langKey) {
            // change the language during runtime
            $translate.use(langKey);
            $http({
                method: 'POST',
                url:    '/api/users/changeLanguage',
                data: $.param({
                    language: langKey}),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data, status){
                    console.log("Success")
                })
                .error(function(err){
                    console.log("error")
                })

        };
        // =============================================================================================================================================
        // POPUP MESSAGE

        $scope.openMessagePopup = function(){
//            $scope.isOpenMessage = true;
            modal.open($scope,'/views/component/messagePopup.html',function(res){
                //  token input
                var jqueryTokenInputs = $('.token-input-list-facebook');
                if(jqueryTokenInputs.length == 0){
                    var query = '/api/getFriendToken/'+$scope.userId+'/off';
                    $('#recipients').tokenInput(
                        query,
                        {
                            theme:'facebook',
                            hintText:"Type in your friend's name",
                            noResultsText: "No friend is matched.",
                            preventDuplicates: true,
                            prePopulate: [{id:$scope.ownerMin.userId,name:$scope.ownerMin.fullName}]
                        }
                    )
                    $(".token-input-dropdown-facebook").css("z-index","9999");
                }else{
                    $('#recipients').tokenInput("add", {id: $scope.ownerMin.userId, name: $scope.ownerMin.fullName});
                }
                $scope.message = {
                    recipients:$scope.ownerMin.userId
                }
            });
        }

        // =============================================================================================================================================
        // POPUP CREATE EVENT
        // NghiaNV - 18/3/2014

        $scope.openCreateEventPopup = function(){
            modal.open($scope,'/views/component/createEventPopup.html',function(res){
                //what's next ?
                var query = '/api/getFriendToken/'+$scope.global.userId+'/off';
                $('input.token-input').tokenInput(
                    query,
                    {
                        theme:'facebook',
                        hintText:"Type in your friend's name",
                        noResultsText: "No friend is matched."
                    }
                );
                $(".token-input-dropdown-facebook").css("z-index","9999");
//                $http.get('/js/locationLibrary.json').success(function(data){
//                    $('input.token-input-location').tokenInput(
//                        data,
//                        {
//                            theme:'facebook',
//                            hintText:"Type in a location",
//                            noResultsText: "No location is found.",
//                            tokenValue:'name'
//                        }
//                    );
//                    $(".token-input-location-dropdown-facebook").css("z-index","9999");
//                });
            });
        }

//        $scope.initMessage = function(friendId){
//            // jquery token input
//            var jqueryTokenInputs = $('.token-input-list-facebook');
//            if(jqueryTokenInputs.length == 0){
//                var query = '/api/getFriendToken/'+$scope.userId+'/off';
//                $('#recipients').tokenInput(
//                    query,
//                    {
//                        theme:'facebook',
//                        hintText:"Type in your friend's name",
//                        noResultsText: "No friend is matched.",
//                        preventDuplicates: true,
//                        prePopulate: [{id:$scope.ownerMin.userId,name:$scope.ownerMin.fullName}]
//                    }
//                )
//                $(".token-input-dropdown-facebook").css("z-index","9999");
//            }else{
//                $('#recipients').tokenInput("add", {id: $scope.ownerMin.userId, name: $scope.ownerMin.fullName});
//            }
//            $scope.message = {
//                recipients:$scope.ownerMin.userId
//            }
//        }

        $scope.send = function(){
            // TODO: disable 2 input
            // check chat log is exist or not
            // get chat log
            Conversation.getChatLog({userId:$scope.global.userId},{participant:$scope.message.recipients},function(conversation){
                // clear error
                if(!conversation.content){
                    // chat log doesn't exist, create a new one
                    var conversation = new Conversation({
                            message: $scope.message.content,
                            participant: $scope.message.recipients
                        }
                    );
                    // add message into content of conversation on client
                    var newMessage = {};
                    newMessage.sender = {
                        userId: $scope.global.userId,
                        username: $scope.global.username,
                        avatar: $scope.global.avatar
                    }
                    newMessage.message = $scope.message.content;
                    // save it
                    conversation.$save(function(conversation){
                        if(conversation.error){
                            // show error
                            $scope.message.error = conversation.error;
                        }else{
                            // save success
                            $scope.message.error = '';
                        }
                        // reset form
                        $scope.message.content = '';
                        // close dialog
                        $scope.isOpenMessage = false;
                        // close modal
                        modal.close();
                        // clear token input
                        $('#recipients').tokenInput('clear');
                        // emit a socket to receiver
                        messageSocket.emit('updateMessage',{'receiverId':$scope.message.recipients},function(result){
                            console.log('sent');
                        });
                        // $scope.message.recipients = [];
                    });
                }else{
                    // it existed, update it
                    // set up message
                    var newMessage = { };
                    newMessage.sender = {
                        userId: $scope.global.userId,
                        username: $scope.global.username,
                        avatar: $scope.global.avatar
                    }
                    newMessage.message = $scope.message.content;
                    // update client
                    conversation.content.push(newMessage);
                    // update server
                    conversation.$update(function(conversation){
                        if(conversation.error){
                            // show error
                            $scope.message.error = conversation.error;
                        }else{
                            // save success
                            $scope.message.error = '';
                        }
                        // reset form
                        $scope.message.content = '';
                        // close dialog
                        $scope.isOpenMessage = false;
                        // close modal
                        modal.close();
                        $('#recipients').tokenInput('clear');
                        // emit a socket to receiver
                        messageSocket.emit('updateMessage',{'receiverId':$scope.message.recipients},function(result){
                            console.log('sent');
                        })
                        //$scope.message.recipients = [];
                    });
                }
            });
        }

        // ============================================================================================================================
        // NOTIFICATION 4 MESSAGE

        $scope.initNotification = function(){
            // Created by Nam
            // Notifications
            // =================================================================================================================
            $(".noti a").mousedown(function () {
                var mrgtb = parseInt($(this).css("margin-top"));
                var mrglf = parseInt($(this).css("margin-left"));
                mrgtb = mrgtb + 2;
                mrglf = mrglf + 0;
                $(this).css("margin-top", mrgtb + "px").css("margin-left", mrglf + "px");
            }).mouseup(function () {
                    var mrgtb = parseInt($(this).css("margin-top"));
                    var mrglf = parseInt($(this).css("margin-left"));
                    mrgtb = mrgtb - 2;
                    mrglf = mrglf - 0;
                    $(this).css("margin-top", mrgtb + "px").css("margin-left", mrglf + "px");
                });

            $(".event-request-icon").click(function () {
                var X = $(this).attr('id');
                if (X == 1) {
                    $(".event-request-item").hide();
                    $(this).attr('id', '0');
                }
                else {
                    $(".event-request-item").show();
                    $(this).attr('id', '1');
                }

                $(".notification-item, .message-item, .friend-request-item").hide();
                $(".noti-icon,.message-icon,.friend-request-icon").attr('id', '');
            });

            $(".friend-request-icon").click(function () {
                var X = $(this).attr('id');
                if (X == 1) {
                    $(".friend-request-item").hide();
                    $(this).attr('id', '0');
                }
                else {
                    $(".friend-request-item").show();
                    $(this).attr('id', '1');
                }

                $(".notification-item, .event-request-item, .message-item").hide();
                $(".noti-icon,.event-request-icon,.message-icon").attr('id', '');
            });

            $(".message-icon").click(function () {
                var X = $(this).attr('id');
                if (X == 1) {
                    $(".message-item").hide();
                    $(this).attr('id', '0');
                }
                else {
                    $(".message-item").show();
                    $(this).attr('id', '1');
                }

                $(".notification-item, .event-request-item,.friend-request-item").hide();
                $(".noti-icon,.event-request-icon,.friend-request-icon").attr('id', '');
            });

            $(".noti-icon").click(function () {
                var X = $(this).attr('id');
                if (X == 1) {
                    $(".notification-item").hide();
                    $(this).attr('id', '0');
                }
                else {
                    $(".notification-item").show();
                    $(this).attr('id', '1');
                }

                $(".event-request-item, .message-item, .friend-request-item").hide();
                $(".event-request-icon,.message-icon,.friend-request-icon").attr('id', '');
            });

            //Mouse click on sub menu
            $(".notification-item, .event-request-item, .message-item, .friend-request-item").mouseup(function () {
                return false
            });

            //Mouse click on my account link
            $(".noti-icon,.event-request-icon,.message-icon,.friend-request-icon").mouseup(function () {
                return false
            });


            //Document Click
            $(document).mouseup(function () {
                $(".notification-item, .event-request-item, .message-item, .friend-request-item").hide();
                $(".noti-icon,.event-request-icon,.message-icon,.friend-request-icon").attr('id', '');
            });
            // =================================================================================================================
            // get notification
            // socket
            homeSocket.emit('join',{userId:$scope.global.userId},function(result){
                console.log('heellll');
            });
            // get friendRequest, notification, event request and alarm unread count
            return $q.all([
                    $http.get('/api/notificationUnreadCount/'+$scope.global.userId),
                    $http.get('/api/friendRequestUnreadCount/'+$scope.global.userId),
                    $http.get('/api/eventRequestUnreadCount/'+$scope.global.userId),
                    $http.get('/api/messageUnreadCount/'+$scope.global.userId)
                ]).then(function(res){
                    // seperate data to easily control
                    $scope.notificationUnreadCount = res[0].data.count;
                    $scope.friendRequestUnreadCount = res[1].data.count;
                    $scope.eventRequestUnreadCount = res[2].data.count;
                    $scope.messageUnreadCount = res[3].data.count;
                });
        }

        $scope.loadNotification = function(){
            Notification.query(function(res){
                $scope.notifications = res;
            })
        }

        $scope.loadFriendRequestNotification = function(){
            FriendRequest.getForNotification({'userId':$scope.global.userId},function(res){
                $scope.friendRequests = res;
                // covert it to notifications
                $scope.friendRequestNotifications = res;
            });
        }

        $scope.loadEventRequestNotification = function(){
            EventRequest.getForNotification({'userId':$scope.global.userId},function(res){
//                for(var i=0;i<res.length;i++){
//                    res[i]['canShow'] = true;
//                    if(!res[i].isInvitation){
//                        if(res[i].senderId !== $scope.global.userId){
//                            res[i]['canShow'] = false;
//                        }
//                    }
//                }
                // binding
                $scope.eventRequests = res;
                // convert it to notifications
                $scope.eventRequestNotifications = res;
            });
        }

        $scope.loadMessageNotification = function(){
            Conversation.query({'userId':$scope.global.userId}, function(res){
                $scope.conversations = res;
                // convert it to notifications
                $scope.messageNotifications = [];
                if(res.length>0){
                    for(var i=0;i<res.length;i++){
                        var temp = {
                            _id             :    res[i]._id,
                            content         :    res[i].content[res[i].content.length-1].message,
                            lastUpdatedDate :    res[i].lastUpdatedDate
                        };
                        // check to get username and image for this notification
                        if(res[i].participant.length == 2){
                            // dual conversation
                            if(res[i].participant[1].userId == $scope.global.userId){
                                // this participant is current user
                                temp.username = res[i].participant[0].username;
                            }else{
                                // this participant is not current user
                                temp.username = res[i].participant[1].username;
                            }
                        }else{
                            temp.image = '/img/avatar/group-default.png';
                            temp.username ='';
                            // group conversation
                            for(var j=0;j<res[i].participant.length;j++){
                                var participant = res[i].participant[j];
                                if(participant.userId != $scope.global.userId){
                                    temp.username += participant.username;
                                    if(j != res[i].participant.length-2){
                                        temp.username += ', ';
                                    }
                                }
                            }
                        }
                        $scope.messageNotifications.push(temp);
                        // set message notification is read
                    }
                }
            });
        }

        $scope.logout = function(){
            $http({
                method: 'GET',
                url: '/logout'
            })
                .success(function(data, status){
                    // success, clear service session
                    Session.username = '';
                    Session.userId = '';
                    Session.fullName = '';
                    Session.avatar = '';
                    Session.isLogged = false;
                    // redirect to /
//                    window.location.href = '/';
                    $location.url('/login');
                });
        }

        $scope.confirmFriendRequest = function(requestId){
            // delete the request just confirmed
            for(var i=0;i<$scope.friendRequestNotifications.length;i++){
                if($scope.friendRequestNotifications[i].id == requestId && $scope.friendRequestNotifications[i].id == requestId){
                    // remove it
                    $scope.friendRequestNotifications.splice(i,1);
                    // update the number of friends
                    if($scope.ownerMin){
                        $scope.ownerMin.friendCount++;
                    }
                    break;
                }
            }
            FriendRequest.confirmRequest({},{'requestId':requestId},function(res){
                if(res.error){
                    $scope.error = res.error;
                }
                // emit a notification that he just confirmed
            });
        }

        $scope.rejectFriendRequest = function(requestId){
            // delete the request just confirmed
            for(var i=0;i<$scope.friendRequestNotifications.length;i++){
                if($scope.friendRequestNotifications[i].id == requestId && $scope.friendRequestNotifications[i].id == requestId){
                    // remove it
                    $scope.friendRequestNotifications.splice(i,1);
                    // update the number of friends
                    if($scope.ownerMin){
                        $scope.ownerMin.friendCount--;
                    }
                    break;
                }
            }
            FriendRequest.rejectRequest({},{'requestId':requestId},function(res){
                if(res.error){
                    $scope.error = res.error;
                }
            });
        }

        $scope.confirmEventRequest = function(eventId,userId){
            var participant = {
                avatar: '',
                userId: userId
            };
            // delete the request just confirmed
            for(var i=0;i<$scope.eventRequestNotifications.length;i++){
                if($scope.eventRequestNotifications[i].userId == userId && $scope.eventRequestNotifications[i].eventId == eventId){
                    // get user avatar
                    participant.avatar = $scope.eventRequestNotifications[i].image;
                    // remove it
                    $scope.eventRequestNotifications.splice(i,1);
                    break;
                }
            }
            EventRequest.confirmRequest({},{'eventId':eventId,'userId':userId},function(res){
                // add user that just confirmed into event
                for(var i=0;i<$scope.posts.length;i++){
                    if($scope.posts[i]._id == eventId){
                        // add it
                        for(var j=0;j<$scope.posts[i].user.length;j++){
                            if($scope.posts[i].user[j].userID == userId){
                                $scope.posts[i].user[j].status = 'confirmed';
                                break;
                            }
                        }
                        break;
                    }
                }
                // TODO: send a notification
            });
        }

        $scope.rejectEventRequest = function(eventId,userId){
            // delete the request just confirmed
            for(var i=0;i<$scope.eventRequestNotifications.length;i++){
                if($scope.eventRequestNotifications[i].userId == userId && $scope.eventRequestNotifications[i].eventId == eventId){
                    // remove it
                    $scope.eventRequestNotifications.splice(i,1);
                    break;
                }
            }
            EventRequest.rejectRequest({},{'eventId':eventId,'userId':userId},function(res){
                if(res.error){
                    $scope.error = error;
                }
            })
        }
        // =================================================================================================================
        // SOCKET

        // update number of unread message
        homeSocket.on('updateMessage',function(data){
            $http.get('/api/messageUnreadCount/'+$scope.global.userId)
                .then(function(res){
                    $scope.messageUnreadCount = res.data.count;
                });
        });
        // update the number of friend request which is unread
        homeSocket.on('updateFriendRequest',function(data){
            $http.get('/api/friendRequestUnreadCount/'+$scope.global.userId)
                .then(function(res){
                    $scope.friendRequestUnreadCount = res.data.count;
                });
        });
        // update the number of event request which is unread
        homeSocket.on('updateEventRequest',function(data){
            $http.get('/api/eventRequestUnreadCount/'+$scope.global.userId)
                .then(function(res){
                    $scope.eventRequestUnreadCount = res.data.count;
                });
        });
        // update comment list
        eventSocket.on('updateComment',function(data){
            // on homepage
            $http.get('/api/notificationUnreadCount/'+$scope.global.userId)
                .then(function(res){
                    $scope.notificationUnreadCount = res.data.count;
                });
            if($scope.posts.length > 0){
                for(var i=0;i<$scope.posts.length;i++){
                    if($scope.posts[i]._id == data.postId){
                        $scope.posts[i].comment.push(data.comment);
                        break;
                    }
                }
            }
        });

        //update Event Intro
        eventSocket.on('updateEventIntro',function(data){
            $http.get('/api/notificationUnreadCount/'+$scope.global.userId)
                .then(function(res){
                    $scope.notificationUnreadCount = res.data.count;
                });
        })

        // =============================================================================================================
        // OTHERS

        // jquery event
        $('a.nav-item').on('click',function(e){
            e.preventDefault();

            var url = $(this).attr('href');
            window.location.href = url;
        });

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
                checkIsNullProfile();
                // call the timeshelf
                $http({
                    method:'GET',
                    url:'/api/timeshelf/'+$scope.ownerId,
                    params: {
                        ids: JSON.stringify(ids)
                    }
                })
                    .success(function(res){
                        Helper.findRightOfCurrentUser(res.events,$scope.global.userId,0,function(err, events){
                            if(err){
                                $scope.error = err;
                            }

                            Helper.findRightToReport(events,$scope.global.userId,0,function(err, events){
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
                    });
            }else{
                // it's the homepage
                $http({
                    method:'GET',
                    url:'/api/homepage/',
                    params: {
                        ids: JSON.stringify(ids)
                    }

                })
                    .success(function(res){
                        Helper.findRightOfCurrentUser(res.events,$scope.global.userId,0,function(err, events){
                            if(err){
                                $scope.error = err;
                            }

                            Helper.findRightToReport(events,$scope.global.userId,0,function(err, events){
                                for(var i=0;i<events.length;i++){
                                    $scope.posts.push(events[i]);
                                }
                                // set that is not busy anymore
                                $scope.scrollIsBusy = false;
                            });
                        });
                    });
            }
        }

        // add comment
        // created by Trung
        // edited by Thuan
        $scope.addComment = function(commentContent, post){
            if(commentContent && commentContent!==''){
                // pre-process
                $('#comment-box-'+post._id).attr('disabled','enabled');
                Users.getProfile({
                    id: $scope.global.userId
                }, function (user) {
                    var comment = {
                        userId: user._id,
                        username: user.local.username,
                        fullName: user.firstName + " " + user.lastName,
                        avatar: user.avatar,
                        datetime: new Date(),
                        content: commentContent
                    }

                    Event.addComment({id: post._id},{comment: comment}, function(event){
                        // Sau khi Save vào database, server sẽ trả về 1 cái ID
                        // Sử dụng các thứ có được ghi ra HTML
                        var newComment = {_id: event.idComment, avatar: comment.avatar, fullName: comment.fullName, username: comment.username, userId: comment.userId, content: comment.content, datetime: event.dateCreated};
//                            post.comment.push(newComment);
                        // Xóa trống chỗ nhập Comment, chuẩn bị cho comment tiếp theo
                        $scope.commentContent = '';
                        // enable comment-box
                        $('#comment-box-'+post._id).removeAttr('disabled');
                        // scroll to bottom
                        $('#list-comment-'+post._id).animate({ scrollTop: $('#list-comment-'+post._id)[0].scrollHeight}, 0);
                        // emit event to server
                        eventSocket.emit('newComment',{'postId':post._id,'comment':newComment});
                    });
                });
            }
        }

        //NghiaNV
        // check IsNullProfile
        function checkIsNullProfile(){
            $http({
                method: 'POST',
                url:    '/api/checkIsNullProfile',
                data: $.param({
                    userID: $scope.ownerId
                }),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            })
                .success(function(data){
                    if(data == 'true'){
                        $scope.isNullProfile = true;
                        console.log("Is Null Profile " + $scope.isNullProfile)
                        $location.path('/404');
                    }
                    else if ( data == 'false'){
                        $scope.isNullProfile = false;
                    }
                })
                .error(function(err){
                    $scope.isProfileError= true;
                    $scope.profileError= err;
                })
        }

        $scope.toBottomComment = function(postId){
            $('#list-comment-'+postId).animate({ scrollTop: $('#list-comment-'+postId)[0].scrollHeight}, 0);
        }
        $scope.$on('commentListFinished', function(ngRepeatFinishedEvent,data) {
            if(!data.data){
                $('#list-comment').animate({ scrollTop: $('#list-comment')[0].scrollHeight}, 0);
            }else{
                $('#list-comment-'+data.data).animate({ scrollTop: $('#list-comment-'+data.data)[0].scrollHeight}, 0);
            }

        });
    }]);

