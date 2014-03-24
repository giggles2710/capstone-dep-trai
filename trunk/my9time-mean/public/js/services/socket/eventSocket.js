/**
 * Created by Noir on 3/24/14.
 */
'use strict'
angular.module('my9time')
    .factory('EventSocket',['$rootScope', function($rootScope){
        var socket = io.connect('/event');
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
