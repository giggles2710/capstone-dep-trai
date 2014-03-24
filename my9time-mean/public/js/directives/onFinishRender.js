/**
 * Created by Noir on 3/24/14.
 */
angular.module('my9time')
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender,{data:attr.onFinishRenderData});
                    });
                }
            }
        }
    });