/**
 * Created by Noir on 25/02/2014.
 */

angular.module('my9time.event')
    .controller('messageAllController',['$scope','$http','Helper','UserSession','Conversation',function($scope,$http,Helper,Session,Conversation){
        $scope.session = Session;
        $scope.participant = [];
        $scope.form = {
            message: ''
        };

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
                console.log('ok');
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
                    // convert participant from client to server
                    $scope.isNew = false;
                }else{
                    $scope.isNew = true;
                }
            });
        }

        $scope.getChatLog = function(friendId,friendUsername,friendAvatar){
            console.log('get chat log '+friendId);
            Conversation.getChatLog({userId:$scope.session.userId},{participant:friendId},function(conversation){
                // clear error
                $scope.error = '';
                $scope.conversation = conversation;
                // if not error
                if($scope.isNew){
                    $scope.isNew = false;
                }
                // get participant
                $scope.participant = []; // empty
                $scope.participant.push({userId: friendId, username: friendUsername});
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
                $scope.form.message = '';
                // save it
                conversation.$save(function(conversation){
                    // update create date for recently message
                    $scope.conversation.content[$scope.conversation.content.length-1].createDate = new Date(conversation.content[conversation.content.length - 1].createDate);
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
                $scope.form.message = '';
                // update server
                $scope.conversation.$update(function(conversation){
                    // update create date
                    $scope.conversation.content[$scope.conversation.content.length-1].createDate = new Date(conversation.content[conversation.content.length - 1].createDate);
                });
            }
        }
    }]);