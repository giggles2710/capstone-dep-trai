/**
 * Created by Noir on 3/5/14.
 */
'use strict'
angular.module('my9time')
    .factory('UserSocket',['$rootScope', function($rootScope){
        var socket = io.connect('/user');
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

