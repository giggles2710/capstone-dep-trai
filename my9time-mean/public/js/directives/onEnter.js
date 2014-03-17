/**
 * Created by ConMeoMauDen on 17/03/2014.
 */
angular.module('my9time')
    .directive('ngEnter', onEnter);

function onEnter(){
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
};
