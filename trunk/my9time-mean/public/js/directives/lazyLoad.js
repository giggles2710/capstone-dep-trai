/**
 * Created by Noir on 2/18/14.
 */

angular.module('my9time.system', []).
    directive('lazyLoad', ['$window', '$q', function ($window, $q) {
        function load_script(src) {
            var s = document.createElement('script'); // use global document since Angular's $document is weak
            s.src = src;
            document.body.appendChild(s);
        }
        function lazyLoadApi(src) {
//            if(sources){
//                var sources = [];
//            }
//            sources.push(src);
            var deferred = $q.defer();
            $window.initialize = function () {
                deferred.resolve();
            };
            // thanks to Emil Stenström: http://friendlybit.com/js/lazy-loading-asyncronous-javascript/
            if ($window.attachEvent) {
                $window.attachEvent('onload', load_script(src));
            } else {
                $window.addEventListener('load', load_script(src), false);
            }
            return deferred.promise;
        }
        return {
            restrict: 'EA',
            scope:{
                src:'@src'
            },
            link: function (scope, element, attrs) {
                lazyLoadApi(scope.src);
            }
        };
    }]);
