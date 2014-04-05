'use strict';

angular.module('my9time', [
    'ngTouch',
    'ngAnimate',
    'ngMobile',
    'my9time.system',
    'my9time.user',
    'my9time.event',
    'my9time.homepage',
    'my9time.calendar',
    'my9time.filters',
    'my9time.directives',
    'ui.router',
    'ui.bootstrap',
    'ui.calendar'
])

angular.module('my9time.system', []);
angular.module('my9time.user', []);
angular.module('my9time.event', []);
angular.module('my9time.homepage', []);
angular.module('my9time.calendar', []);