/**
 * Created by Nova on 2/17/14.
 */

angular.module('my9time.system')
    .factory('Helper',function(){
        return {
            formatDate:function(date){
                var dd = ("0" + date.getDate()).slice(-2);
                var mm = ("0" + (date.getMonth() + 1)).slice(-2);
                var yy = date.getFullYear();
                var today = yy+'-'+mm+'-'+dd;
                return today;
            },
            apply:function(scope){
                if(!scope.$$phase) {
                    //$digest or $apply
                    scope.$apply();
                }
            }
        }
    });
