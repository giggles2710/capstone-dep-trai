
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },


    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('load', this.onLoad, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener("orientationchange", orientationChange, true);
    },
    onLoad: function() {
        
    },
   
    // deviceready Event Handler
    onDeviceReady: function() {
        console.log('Device Ready');
        deviceReadyDeferred.resolve();
//        deviceReadyDeferred.resolve();
//        angular.element(document).ready(function() {
//            angular.bootstrap(document, ['my9time']);
//        });
    },

    receivedEvent: function(id){
//        var parentElement = document.getElementById(id);
//        var listeningElement = parentElement.querySelector('.listening');
//        var receivedElement = parentElement.querySelector('.received');
//
//        listeningElement.setAttribute('style', 'display:none');
//        receivedElement.setAttribute('style', 'display:block');
        console.log('Recevied Event:   ' + id)
    }
};
