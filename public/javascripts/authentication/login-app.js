/**
 * Created by Noir on 1/8/14.
 */
angular.module('toForm',[])
.directive(toSubmitDirective)
.filter('shouldDisplayError',shouldDisplayErrorFilter);

// define module for this app
angular.module('loginApp',['ngRoute','toForm'])
    .config(function($routeProvider, $locationProvider){
        $locationProvider.html5Mode(true);
    });