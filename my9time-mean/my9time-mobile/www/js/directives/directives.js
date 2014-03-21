'use strict';

/* Directives */
angular.module('my9time.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
          elm.text(version);
}}]);
angular.module('my9time.directives', [])
    .directive('jqueryMobileTpl', function() {
    return {
        link: function(scope, elm, attr) {
            elm.trigger('create');
        }
    };
});
