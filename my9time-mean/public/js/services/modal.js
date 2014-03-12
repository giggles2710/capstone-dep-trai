/**
 * Created by Noir on 3/12/14.
 */
angular.module('my9time.system')
    .factory('Modal',['$http','$compile', function($http,$compile){
        var currentModalId;
        return {
            open: function(scope,templateUrl,cb){
                // clear the old modal
                if(currentModalId){
                    $(currentModalId).remove();
                }
                $http.get(templateUrl).then(function(res){
                    $('body').append($compile(res.data)(scope));
                    // find the id
                    currentModalId = '#' + $(res.data).attr('id');
                    // open the modal
                    $(currentModalId).modal('show');
                    return cb();
                });
            },
            close: function(){
                $(currentModalId).modal('toggle');
                // clear the old modal
                $(currentModalId).remove();
                // clear the body
                $('body').removeClass('modal-open');
                // clear the background
                $('div.modal-backdrop.fade.in').remove();
            }
        }
    }]);