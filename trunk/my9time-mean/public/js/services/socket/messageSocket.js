/**
 * Created by Noir on 3/1/14.
 *
 * reference by http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
 *
 */
'use strict'
angular.module('my9time')
    .factory('MessageSocket',['$rootScope', function($rootScope){
        var socket = io.connect('/message');
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
