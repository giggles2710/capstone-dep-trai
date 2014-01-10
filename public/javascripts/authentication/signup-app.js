/**
 * Created by Noir on 1/9/14.
 */

angular.module('toForm',[])
.directive(toSubmitDirective)
.directive(toDateValidDirective)
.directive(toCheckUniqueDirective)
.filter('shouldDisplayError', shouldDisplayErrorFilter)

angular.module('signUpApp',['ngRoute','ngSanitize','toForm'])
    .config(function($routeProvider, $locationProvider){
        $locationProvider.html5Mode(true);
    });