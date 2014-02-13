/**
 * Created by Nova on 2/13/14.
 */
angular.module('my9time.event')
    .directive('miSubmit',['$parse', MiSubmitDirective])
    .directive('miCheckUniqueName',['$http', MiCheckUniqueDirective]);

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
                    submitFunction(scope, {$event:event});
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
                        url     :   '/api/checkUniqueName',
                        data    :   $.param({target: value}),
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


