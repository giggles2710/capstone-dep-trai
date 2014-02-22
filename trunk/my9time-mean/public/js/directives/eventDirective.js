/**
 * Created by Nova on 2/13/14.
 */
angular.module('my9time.system')
    .directive('miSubmitEvent',['$parse', MiSubmitDirective])
    .directive('miCheckUniqueName',['$http', MiCheckUniqueDirective])
    .directive('miCheckDate', MiDateCheckDirective);

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

function MiDateCheckDirective(){
    return{
        require: 'ngModel',
        restrict: 'EA',
        link: function(scope, element, attributes, ctrl){

            scope.$watch(function(){
                return ctrl.$viewValue;
            },function(value){
                var start = scope.createForm.start.$viewValue;
                var end = scope.createForm.end.$viewValue;

                scope.createForm.start.$setValidity('daterequired', start ? true : false );
                scope.createForm.end.$setValidity('daterequired', end ? true : false);

                if(start && end){
                    // hide error of required fields
                    if(end>start){
                        scope.createForm.start.$setValidity('datevalid', true);
                        scope.createForm.end.$setValidity('datevalid', true);
                    }else{
                        scope.createForm.start.$setValidity('datevalid', false);
                        scope.createForm.end.$setValidity('datevalid', false);
                    }
                }
            });
        }
    }
}

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


