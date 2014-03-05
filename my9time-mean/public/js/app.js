'use strict';

angular.module('my9time', ['ngCookies', 'ngResource', 'ngRoute', 'ngAnimate', 'ngSanitize', 'ui','ui.calendar', 'ui.bootstrap', 'ui.route', 'my9time.system','my9time.filter','my9time.user','my9time.event','my9time.group', 'my9time.admin', 'my9time.message', 'my9time.notification','my9time.homepage','my9time.timeshelf','my9time.calendar','angularFileUpload','cropme']);

angular.module('my9time.system', []);
angular.module('my9time.filter',[]);
angular.module('my9time.user', ['angularFileUpload', 'ui']);
angular.module('my9time.event',['imageupload', 'ui.bootstrap']);
angular.module('my9time.homepage',[]);
angular.module('my9time.timeshelf',[]);
angular.module('my9time.calendar',[]);
//TrungNM
angular.module('my9time.group',[]);
angular.module('my9time.admin',[]);
angular.module('my9time.notification',[]);
angular.module('my9time.message',[]);
angular.module('waypoints', ['ui']);


