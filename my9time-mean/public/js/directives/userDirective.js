/**
 * Created by Noir on 1/16/14.
 */
'use strict'

angular.module('my9time')
    .directive('miSubmit',['$parse', MiSubmitDirective])
    .directive('miCheckUnique',['$http', MiCheckUniqueDirective])
    .directive('miDateValid', MiDateValidDirective);

function MiSubmitDirective($parse){
    return{
        restrict: 'EA',
        link:function(scope, element, attributes){
            // $parse to get function login()
            var submitFunction = $parse(attributes.miSubmit);

            element.bind('submit', function(){
                scope.$apply(function(){
                    // we try to submit the form
                    // setting attempted to true to make the errors displayable

                    scope[attributes.name].attempted = true;
                });
                // if form is not valid cancel it
                if(!scope[attributes.name].$valid){
                    return false;
                }

                // form valid, final submit
                scope.$apply(function(){
                    // execute login()
                    submitFunction(scope);
//                    submitFunction(scope, {$event:event});
                });
            });
        }
    }
}

function MiCheckUniqueDirective($http){
    return {
        restrict: 'EA',
        require: 'ngModel',
        link:function(scope, elm, attrs, ctrl){
            scope.$watch(function(){
                return ctrl.$viewValue;
            },function(value){
                if(!ctrl.$invalid){
                    $http({
                        method  :   'POST',
                        url     :   '/api/checkUnique',
                        data    :   $.param({target: value,type: ctrl.$name}),
                        headers :   {'Content-Type':'application/x-www-form-urlencoded'}
                    })
                        .success(function(data, status){
                            ctrl.$setValidity('unique', true);
                        })
                        .error(function(data, status){
                            ctrl.$setValidity('unique', false);
                        });
                }else{
                    ctrl.$setValidity('unique', true);
                }
            });
        }
    }
}

function MiDateValidDirective(){
        return{
            require: 'ngModel',
            restrict: 'EA',
            link: function(scope, element, attributes, ctrl){

                scope.$watch(function(){
                    return ctrl.$viewValue;
                },function(value){
                    var date = scope.registerForm.date.$viewValue;
                    var month = scope.registerForm.month.$viewValue;
                    var year = scope.registerForm.year.$viewValue;

//                    scope.registerForm.date.$setValidity('daterequired', date ? true : false );
//                    scope.registerForm.month.$setValidity('daterequired', month ? true : false);
//                    scope.registerForm.year.$setValidity('daterequired', year ? true : false);

                    if(month!=='--' && year!=='----' && date!=='--'){
                        // hide error of required fields
                        var result = (new Date(year, month, 0).getDate() >= date);
                        if(result){
                            scope.registerForm.date.$setValidity('datevalid', true);
                            scope.registerForm.month.$setValidity('datevalid', true);
                            scope.registerForm.year.$setValidity('datevalid', true);
                        }else{
                            scope.registerForm.date.$setValidity('datevalid', false);
                            scope.registerForm.month.$setValidity('datevalid', false);
                            scope.registerForm.year.$setValidity('datevalid', false);
                        }
                    }
                });
            }
        }
}

