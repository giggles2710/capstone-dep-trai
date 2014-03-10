/**
 * Created by ConMeoMauDen on 02/03/2014.
 */

angular.module('my9time')
    .directive('imgCropped', imgCropped)
    .directive('coverCropped', coverCropped)
//    .directive('miCheckDate', MiDateCheckDirective);

function imgCropped() {
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

                        var temp = new Image();
                        temp.src = nv;
                        temp.onload = function() {
                            var width = this.width;
                            var height = this.height;

                            $(myImg).Jcrop({
                                trackDocument: true,
                                onSelect: function(x) {
                                    /*if (!scope.$$phase) {
                                     scope.$apply(function() {
                                     scope.selected({cords: x});
                                     });
                                     }*/
                                    scope.selected({cords: x});
                                },
                                aspectRatio: 1,
                                setSelect: [0, 0, 200, 200],
                                trueSize: [width, height]
                            });
                        }
                    }
                });

                scope.$on('$destroy', clear);
            }
        };
    }

function coverCropped() {
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

                    var temp = new Image();
                    temp.src = nv;
                    temp.onload = function() {
                        var width = this.width;
                        var height = this.height;

                        $(myImg).Jcrop({
                            trackDocument: true,
                            onSelect: function(x) {
                                /*if (!scope.$$phase) {
                                 scope.$apply(function() {
                                 scope.selected({cords: x});
                                 });
                                 }*/
                                scope.selected({cords: x});
                            },
                            // TODO: Chỗ để chỉnh tỉ lệ ảnh
                            aspectRatio: 4,
                            setSelect: [0, 0, 200, 200],
                            trueSize: [width, height]
                        });
                    }
                }
            });

            scope.$on('$destroy', clear);
        }
    };
}
