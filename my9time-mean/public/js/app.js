'use strict';

angular.module('my9time', ['ngCookies', 'ngResource', 'ngRoute', 'ui','ui.calendar', 'ui.bootstrap', 'ui.route', 'my9time.system','my9time.user','my9time.event']);

angular.module('my9time.system', []);
angular.module('my9time.user', []);
angular.module('my9time.event',[]);