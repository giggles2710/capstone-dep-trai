/**
 * Created by Noir on 25/02/2014.
 */

angular.module('my9time.event')
    .controller('messageAllController',['$scope','$http','Helper','UserSession','Conversation','MessageSocket',function($scope,$http,Helper,Session,Conversation,messageSocket){
        $scope.session = Session;
        $scope.participant = [];
        $scope.leftPanelStatus = 'rc';
        $scope.form = {
            message: ''
        };

        $scope.leftPanelInit = function(filter){
            if(filter == 'rc'){
                // load recent chat logs
                $scope.getRecentChatters();
            }else{
                // load friend list
                $scope.getAllFriends();
            }
        }

        $scope.getRecentChatters = function(){
            Helper.getRecentChatters($scope.session.userId, function(err, chats){
                if(err){
                    $scope.error = err;
                }

                // clear error
                $scope.error = '';
                $scope.friends = chats;
                // convert data from server to client format
                for(var i=0;i<$scope.friends.length;i++){
                    if($scope.friends[i].participant.length > 2){
                        // more than 2 people
                        // eliminate current user
                        for(var j=0;j<$scope.friends[i].participant.length;j++){
                            var participant = $scope.friends[i].participant[j];
                            if(participant.userId==$scope.session.userId){
                                // eliminate current user
                                $scope.friends[i].participant.splice(j,1);
                                ++j;
                            }
                        }
                        // it's group
                        $scope.friends[i].image = 'img/avatar/group-default.png';
                    }else{
                        // less than 2 people
                        if($scope.friends[i].participant[0].userId == $scope.session.userId){
                            $scope.friends[i].participant.splice(0,1);
                        }else{
                            $scope.friends[i].participant.splice(1,1);
                        }
                        // update image
                        $scope.friends[i].image = $scope.friends[i].participant[0].avatar;
                    }
                }
            });
        }

        $scope.getAllFriends = function(){
            Helper.getAllFriends($scope.session.userId, function(err, friends){
                if(err){
                    $scope.error = err;
                }
                // clear error
                $scope.error = '';
                $scope.friends = friends;
            });
        }

        $scope.getRecentConversation = function(){
            console.log('preapare');
            Conversation.getRecentChat({userId:$scope.session.userId}, function(conversation){
                messageSocket.emit('joinChatroom',{'conversationId':conversation._id});
                $scope.error = '';
                $scope.conversation = conversation;
                if($scope.conversation.content){
                    // eliminate the participant who is current user
                    for(var i=0;i<conversation.participant.length;i++){
                        var participant = conversation.participant[i];
                        if(participant.userId == $scope.session.userId){
                            // it's the current user
                            // delete him
                            conversation.participant.splice(i,1);
                        }
                    }
                    // bind to $scope
                    $scope.participant = conversation.participant;
                    // convert conversation to designed format
                    $scope.viewConversation = [];
                    for(var i=0;i<conversation.content.length;i++){
                        var content = conversation.content[i];
                        if($scope.viewConversation.length > 0){
                            var previousPart = $scope.viewConversation[$scope.viewConversation.length-1];
                            // if the previous part has the same user as this part
                            if(previousPart.sender.userId == content.sender.userId){
                                // update the message for the previous part
                                $scope.viewConversation[$scope.viewConversation.length-1]
                                    .messages.push({message:content.message,createDate:content.createDate});
                            }else{
                                // create a new part
                                var part = {
                                    sender: content.sender,
                                    messages: [{message:content.message,createDate:content.createDate}]
                                };
                                $scope.viewConversation.push(part);
                            }
                        }else{
                            // create a new part
                            var part = {
                                sender: content.sender,
                                messages: [{message:content.message,createDate:content.createDate}]
                            };
                            $scope.viewConversation.push(part);
                        }
                    }
                    $scope.isNew = false;
                }else{
                    $scope.isNew = true;
                }
            });
        }

        $scope.getChatLogById =function(conversationId){
            Conversation.get({id:conversationId},function(conversation){
                // join into this room
                messageSocket.emit('joinChatroom',{'conversationId':conversationId});
                // clear error
                $scope.error = '';
                $scope.conversation = conversation;
                // convert conversation to designed format
                $scope.viewConversation = [];
                for(var i=0;i<conversation.content.length;i++){
                    var content = conversation.content[i];
                    if($scope.viewConversation.length > 0){
                        var previousPart = $scope.viewConversation[$scope.viewConversation.length-1];
                        // if the previous part has the same user as this part
                        if(previousPart.sender.userId == content.sender.userId){
                            // update the message for the previous part
                            $scope.viewConversation[$scope.viewConversation.length-1]
                                .messages.push({message:content.message,createDate:content.createDate});
                        }else{
                            // create a new part
                            var part = {
                                sender: content.sender,
                                messages: [{message:content.message,createDate:content.createDate}]
                            };
                            $scope.viewConversation.push(part);
                        }
                    }else{
                        // create a new part
                        var part = {
                            sender: content.sender,
                            messages: [{message:content.message,createDate:content.createDate}]
                        };
                        $scope.viewConversation.push(part);
                    }
                }
                // if not error
                if($scope.isNew){
                    $scope.isNew = false;
                }
                // get participant
                $scope.participant = []; // empty
                // $scope.participant in this format {userId, username}
                // convert data from server to client format
                for(var i=0;i<conversation.participant.length;i++){
                    if(!conversation.participant[i].userId === $scope.session.userId){
                        // it's not the current user, then add it into
                        $scope.participant.push({userId: conversation.participant[i].userId, username: conversation.participant[i].username});
                    }
                }
            });
        }

        $scope.getChatLog = function(friendId,friendUsername,friendAvatar){
            Conversation.getChatLog({userId:$scope.session.userId},{participant:friendId},function(conversation){
                // join into this room
                messageSocket.emit('joinChatroom',{'conversationId':conversation._id});
                // clear error
                $scope.error = '';
                $scope.conversation = conversation;
                // convert conversation to designed format
                $scope.viewConversation = [];
                for(var i=0;i<conversation.content.length;i++){
                    var content = conversation.content[i];
                    if($scope.viewConversation.length > 0){
                        var previousPart = $scope.viewConversation[$scope.viewConversation.length-1];
                        // if the previous part has the same user as this part
                        if(previousPart.sender.userId == content.sender.userId){
                            // update the message for the previous part
                            $scope.viewConversation[$scope.viewConversation.length-1]
                                .messages.push({message:content.message,createDate:content.createDate});
                        }else{
                            // create a new part
                            var part = {
                                sender: content.sender,
                                messages: [{message:content.message,createDate:content.createDate}]
                            };
                            $scope.viewConversation.push(part);
                        }
                    }else{
                        // create a new part
                        var part = {
                            sender: content.sender,
                            messages: [{message:content.message,createDate:content.createDate}]
                        };
                        $scope.viewConversation.push(part);
                    }
                }
                // if not error
                if($scope.isNew){
                    $scope.isNew = false;
                }
                // get participant
                $scope.participant = []; // empty
                // $scope.participant in this format {userId, username}
                // convert data from server to client format
                for(var i=0;i<conversation.participant.length;i++){
                    if(!conversation.participant[i].userId === $scope.session.userId){
                        // it's not the current user, then add it into
                        $scope.participant.push({userId: conversation.participant[i].userId, username: conversation.participant[i].username});
                    }
                }
            });
        }

        $scope.reply = function(){
            // this is the first time
            if(!$scope.conversation.content){
                var conversation = new Conversation({
                        message: $scope.form.message,
                        participant: $scope.participant
                    }
                );
                // add message into content of conversation on client
                var newMessage = {};
                newMessage.sender = {
                    userId: $scope.session.userId,
                    username: $scope.session.username,
                    avatar: $scope.session.avatar
                }
                newMessage.message = $scope.form.message;
                // add
                $scope.conversation.content = [];
                $scope.conversation.content.push(newMessage);
                // convert conversation to designed format
                if($scope.viewConversation.length > 0){
                    var previousPart = $scope.viewConversation[$scope.viewConversation.length-1];
                    // if the previous part has the same user as this part
                    if(previousPart.sender.userId == newMessage.sender.userId){
                        // update the message for the previous part
                        $scope.viewConversation[$scope.viewConversation.length-1]
                            .messages.push({message:$scope.form.message,createDate:""});
                    }else{
                        // create a new part
                        var part = {
                            sender: newMessage.sender,
                            messages: [{message:$scope.form.message,createDate:""}]
                        };
                        $scope.viewConversation.push(part);
                    }
                }else{
                    // create a new part
                    var part = {
                        sender: newMessage.sender,
                        messages: [{message:$scope.form.message,createDate:""}]
                    };
                    $scope.viewConversation.push(part);
                }
                $scope.form.message = '';
                // save it
                conversation.$save(function(conversation){
                    // update create date for recently message
                    $scope.conversation.content[$scope.conversation.content.length-1].createDate = new Date(conversation.content[conversation.content.length - 1].createDate);
                    // update on viewConversation
                    $scope.viewConversation[$scope.viewConversation.length - 1]
                        .messages[$scope.viewConversation[$scope.viewConversation.length - 1].messages.length - 1]
                        .createDate = new Date(conversation.content[conversation.content.length - 1].createDate);
                    // announce that i just replied
                    messageSocket.emit('replied',{conversationId: conversation._id,message:$scope.viewConversation[$scope.viewConversation.length - 1]});
                });
            }else{
                // set up message
                var newMessage = { };
                newMessage.sender = {
                    userId: $scope.session.userId,
                    username: $scope.session.username,
                    avatar: $scope.session.avatar
                }
                newMessage.message = $scope.form.message;
                // update client
                $scope.conversation.content.push(newMessage);
                // convert conversation to designed format
                if($scope.viewConversation.length > 0){
                    var previousPart = $scope.viewConversation[$scope.viewConversation.length-1];
                    // if the previous part has the same user as this part
                    if(previousPart.sender.userId == newMessage.sender.userId){
                        // update the message for the previous part
                        $scope.viewConversation[$scope.viewConversation.length-1]
                            .messages.push({message:$scope.form.message,createDate:""});
                    }else{
                        // create a new part
                        var part = {
                            sender: newMessage.sender,
                            messages: [{message:$scope.form.message,createDate:""}]
                        };
                        $scope.viewConversation.push(part);
                    }
                }else{
                    // create a new part
                    var part = {
                        sender: newMessage.sender,
                        messages: [{message:$scope.form.message,createDate:""}]
                    };
                    $scope.viewConversation.push(part);
                }
                $scope.form.message = '';
                // update server
                // ================================== final callback
                $scope.conversation.$update(function(conversation){
                    // update create date
                    $scope.conversation.content[$scope.conversation.content.length-1].createDate = new Date(conversation.content[conversation.content.length - 1].createDate);
                    // update on viewConversation
                    $scope.viewConversation[$scope.viewConversation.length - 1]
                        .messages[$scope.viewConversation[$scope.viewConversation.length - 1].messages.length - 1]
                        .createDate = new Date(conversation.content[conversation.content.length - 1].createDate);
                    // announce that i just replied
                    messageSocket.emit('replied',{conversationId: conversation._id, message:$scope.viewConversation[$scope.viewConversation.length - 1]});
                });
            }
        }

        // =============================================================================================================
        // SOCKET

        messageSocket.on('updateChatroom',function(data){
             // $scope.viewConversation.push(data.message); // update on client
            // get update from server
            Conversation.get({
                id: $scope.conversation._id
            }, function(conversation) {
                $scope.conversation = conversation;
                // convert conversation to designed format
                $scope.viewConversation = [];
                for(var i=0;i<conversation.content.length;i++){
                    var content = conversation.content[i];
                    if($scope.viewConversation.length > 0){
                        var previousPart = $scope.viewConversation[$scope.viewConversation.length-1];
                        // if the previous part has the same user as this part
                        if(previousPart.sender.userId == content.sender.userId){
                            // update the message for the previous part
                            $scope.viewConversation[$scope.viewConversation.length-1]
                                .messages.push({message:content.message,createDate:content.createDate});
                        }else{
                            // create a new part
                            var part = {
                                sender: content.sender,
                                messages: [{message:content.message,createDate:content.createDate}]
                            };
                            $scope.viewConversation.push(part);
                        }
                    }else{
                        // create a new part
                        var part = {
                            sender: content.sender,
                            messages: [{message:content.message,createDate:content.createDate}]
                        };
                        $scope.viewConversation.push(part);
                    }
                }
            });
        });
    }]);