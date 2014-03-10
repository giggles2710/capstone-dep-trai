/**
 * Created by TrungNM on 10/3/2014.
 *
 * reference by http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
 *
 */
'use strict'
angular.module('my9time')
    .factory('commentSocket',['$rootScope', function($rootScope){
        var socket = io.connect('/comment');
        return{
            on: function(eventName, callback){
                socket.on(eventName, function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback){
                socket.emit(eventName, data, function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        if(callback){
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        }
    }]);
