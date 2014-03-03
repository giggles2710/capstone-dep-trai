/**
 * Created by ConMeoMauDen on 02/03/2014.
 */

var app = angular.module('my9time.event', []);

app.directive('imgCropped', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: { src:'@', selected:'&' },
        link: function(scope,element, attr) {
            var myImg;
            var clear = function() {
                if (myImg) {
                    myImg.next().remove();
                    myImg.remove();
                    myImg = undefined;
                }
            };
            scope.$watch('src', function(nv) {
                clear();
                if (nv) {
                    element.after('<img />');
                    myImg = element.next();
                    myImg.attr('src',nv);
                    $(myImg).Jcrop({
                            trackDocument: true,
                            onSelect: function(x) {
                                scope.$apply(function() {
                                    scope.selected({cords: x});
                                });
                            }
                        },
                        function () {
                            // Use the API to get the real image size
                            var bounds = this.getBounds();
                            boundx = bounds[0];
                            boundy = bounds[1];
                        });
                }
            });

            scope.$on('$destroy', clear);
        }
    };
});