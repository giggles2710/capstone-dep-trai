/**
 * Created by Noir on 25/02/2014.
 */

angular.module('my9time.event')
    .controller('messageAllController',['$scope','$http','Helper','UserSession',function($scope,$http,Helper,Session){
        $scope.session = Session;
        $scope.hello = {
            list:'list',
            message: 'message'
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
            console.log('im loaded');
//            Helper.getRecentConversation($scope.session.userId, function(err, conversation){
//                if(err){
//                    $scope.error = err;
//                }
//
//                // clear error
//                $scope.error = '';
//                $scope.conversation = conversation;
//            });
        }

        $scope.getChatLog = function(friendId){
            Conversation.get({conversationId:$scope.session.userId},{participant:friendId},function(conversation){
                // clear error
                $scope.error = '';
                $scope.conversation = {};
                if(conversation){
                    $scope.conversation = conversation;
                }
            });
        }

        $scope.reply = function(){
            // set up message
            var template = $scope.conversation.content[0];
            var newMessage = { };
            newMessage.sender = {
                userId: template.sender.userId,
                username: template.sender.username,
                avatar: template.sender.avatar
            }
            newMessage.message = $scope.message;
            // update client
            $scope.conversation.content.push(newMessage);
            // update server
            Conversation.$update(function(conversation){
                // update create date
                $scope.conversation.content[$scope.conversation.content.length - 1].createDate = conversation.content[conversation.length - 1].createDate;
            });
        }
    }]);