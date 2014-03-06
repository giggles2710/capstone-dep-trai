/**
 * Created by Noir on 2/14/14.
 */
angular.module('my9time.event').controller('HomepageController', ['$scope','$location','UserSession','Event','$routeParams','$q','$http','Helper','$window','Conversation','Notifications','FriendRequest','EventRequest','HomepageSocket','MessageSocket','$translate',
    function($scope , $location ,Session, Event, $routeParams, $q, $http, Helper, window, Conversation, Notification, FriendRequest, EventRequest, homeSocket, messageSocket,$translate){
        $(window).on('scroll',function() {
            if ($(this).scrollTop() > $("#tdl-spmenu-s2").offset().top) {
                $("#tdl-spmenu-s2").stop().animate({
                    marginTop: $(this).scrollTop() - $("#tdl-spmenu-s2").offset().top + 20
                });
            } else {
                $("#tdl-spmenu-s2").stop().animate({
                    marginTop: 0
                });
            }
        });
        // binding click event to open to-do window
        $('#btn').on('click',function(){
            if($('#tdl-spmenu-s2').hasClass('tdl-spmenu-open')){
                $('#tdl-spmenu-s2').removeClass('tdl-spmenu-open');
            }else{
                $('#tdl-spmenu-s2').addClass('tdl-spmenu-open');
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

        var menuRight = document.getElementById('tdl-spmenu-s2'),
            showRight = document.getElementById('btn'),
            body = document.body;

        showRight.onclick = function () {
            if($(this).hasClass('tdl-spmenu-open')){
                $(this).removeClass('tdl-spmenu-open');
            }else{
                $(this).addClass('tdl-spmenu-open');
            }
        };

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
        $scope.isInitTimeshelf = false;
        $scope.isInitEvent = false;
        // Nghĩa thêm vô Language
        $scope.language = "";

        // ====================================================================================================================================
        // HOMEPAGE n TIMESHELF

        $scope.initialize = function(){
            var path = $location.path();
            //set language
            $http({
                method:'GET',
                url:'/api/users/getLanguage'
            })
                .success(function(res){
                    console.log('res.language ' + res.language);
                    $translate.use(res.language);
                });

            if(path.indexOf('homepage')>-1){
                // it's the homepage
                $http({
                    method:'GET',
                    url:'/api/homepage/'
                })
                    .success(function(res){
                        console.log('posts loaded');
                        $scope.posts = res.events;
                        // anounce that we loaded events
                        $scope.isInitEvent = true;
                    });
            }else if(path.indexOf('timeshelf')>-1){
                // it's the timeshelf
                $scope.ownerId = $routeParams.userId; // owner id for add friend
                // call the timeshelf
                $http({
                    method:'GET',
                    url:'/api/timeshelf/'+$scope.ownerId
                })
                    .success(function(res){
                        console.log('posts loaded');
                        $scope.posts = res.events;
                        // anounce that we loaded events
                        $scope.isInitEvent = true;
                        // seperate some common attributes from user to use easier
                        $scope.ownerMin = {};
                        $scope.ownerMin.userId = res.user._id; // user id
                        $scope.ownerMin.fullName = res.user.lastName + ' ' + res.user.firstName; // fullname
                        $scope.ownerMin.createDate = new Date(res.user.createDate); // create date
                        $scope.ownerMin.friendCount = res.user.friend.length; // friend count
                        // avatar n username
                        switch (res.user.provider){
                            case "facebook":
                                $scope.ownerMin.avatar = res.user.facebook.avatar;
                                $scope.ownerMin.username = res.user.facebook.displayName;
                                break;
                            case "google":
                                $scope.ownerMin.avatar = res.user.google.avatar;
                                $scope.ownerMin.username = res.user.google.displayName;
                                break;
                            case "local":
                                $scope.ownerMin.avatar = res.user.avatar;
                                $scope.ownerMin.username = res.user.local.username;
                        }
                        // announce that we loaded timeshelf panel
                        $scope.isInitTimeshelf = true;
                    });
            }else{
                console.log("it's the messages page");
            }
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

        $scope.initMessage = function(friendId){
            // jquery token input
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
        }

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
                        $('#new-message-modal').modal('toggle');
                        $('#recipients').tokenInput('clear');
                        // emit a socket to receiver
                        messageSocket.emit('updateMessage',{'receiverId':$scope.message.recipients},function(result){
                            console.log('sent');
                        });
                        // $scope.message.recipients = [];
                        $scope.openNewMessage = false;
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
                        $('#new-message-modal').modal('toggle');
                        $('#recipients').tokenInput('clear');
                        // emit a socket to receiver
                        messageSocket.emit('updateMessage',{'receiverId':$scope.message.recipients},function(result){
                            console.log('sent');
                        })
                        //$scope.message.recipients = [];
                        $scope.openNewMessage = false;
                    });
                }
            });
        }

        // ============================================================================================================================
        // NOTIFICATION 4 MESSAGE

        $scope.initNotification = function(){
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

//        return $q.all([
//            Notification.query({'userId':$scope.global.userId}).$promise,
//            FriendRequest.query({'userId':$scope.global.userId}).$promise,
//            EventRequest.query({'userId':$scope.global.userId}).$promise
//        ]).then(function(res){
//                // seperate data to easily control
//                $scope.notifications = res[0];
//                $scope.friendRequests = res[1];
//                $scope.eventRequests = res[2];
//                // binding result to $scope
//            });
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
                                    if(j != res[i].participant.length - 1){
                                        temp.username += ', ';
                                    }
                                }
                            }
                        }
//                    if(res[i].content[res[i].content.length-1].sender.userId == $scope.global.userId){
//                        // it's me then get the other participant
//                        if(res[i].participant.length>2){
//                            // if it's multiple participant, then merge their username
//                            temp.username = res[i].participant[0].username;
//                            for(var j=1;j<res[i].participant.length-1;j++){
//                                temp.username += ', ' + res[i].participant[j].username;
//                            }
//                            // image is group image
//                            temp.image = '/img/avatar/group-default.png';
//                        }else{
//                            // show the other participant
//                            temp.username = res[i].participant[0].username;
//                            temp.image = res[i].participant[0].avatar;
//                        }
//                    }else{
//
//                    }
                        $scope.messageNotifications.push(temp);
                        // set message notification is read
                    }
                }
            });
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


        // jquery event
        $('a.nav-item').on('click',function(e){
            e.preventDefault();

            var url = $(this).attr('href');
            window.location.href = url;
//        $location.path(url);
//        Helper.apply($scope);
        });
    }]);

