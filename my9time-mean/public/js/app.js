'use strict';

angular.module('my9time', ['ngCookies', 'ngResource', 'ngRoute', 'ngAnimate', 'ngSanitize', 'ui','ui.calendar', 'ui.bootstrap','ui.bootstrap.datetimepicker', 'ui.route', 'my9time.system','my9time.user','my9time.event','my9time.group', 'my9time.admin', 'my9time.message', 'my9time.notification','my9time.homepage','my9time.timeshelf','my9time.calendar','angularFileUpload']);

angular.module('my9time.system', []);
angular.module('my9time.user', ['angularFileUpload']);
angular.module('my9time.event',['imageupload']);
angular.module('my9time.homepage',[]);
angular.module('my9time.timeshelf',[]);
angular.module('my9time.calendar',[]);
//TrungNM
angular.module('my9time.group',[]);
angular.module('my9time.admin',[]);
angular.module('my9time.notification',[]);
angular.module('my9time.message',[]);

