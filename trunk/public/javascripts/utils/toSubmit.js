/**
 * Created by Noir on 1/8/14.
 */

var toSubmitDirective = {
    'toSubmit':['$parse', function($parse){
        return{
            restrict: 'A',
            link:function(scope, element, attributes){
                // $parse to get function login()
                var submitFunction = $parse(attributes.toSubmit);

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
    }]
}

var toCheckUniqueDirective = {
    'toCheckUnique':function($http){
        return {
            restrict: 'A',
            require: 'ngModel',
            link:function(scope, elm, attrs, ctrl){
                scope.$watch(function(){
                    return ctrl.$viewValue;
                },function(value){
                    if(!ctrl.$invalid){
                        $http({
                            method  :   'POST',
                            url     :   '/checkUnique',
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
                })
            }
        }
    }
}

var toDateValidDirective = {
    'toDateValid':function($document){
        return{
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attributes, ctrl){

                scope.$watch(function(){
                    return ctrl.$viewValue;
                },function(value){
                    var date = scope.registerForm.date.$viewValue;
                    var month = scope.registerForm.month.$viewValue;
                    var year = scope.registerForm.year.$viewValue;

                    scope.registerForm.date.$setValidity('daterequired', date ? true : false );
                    scope.registerForm.month.$setValidity('daterequired', month ? true : false);
                    scope.registerForm.year.$setValidity('daterequired', year ? true : false);

                    if(month && year && date){
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
}

var shouldDisplayErrorFilter = function(){
    return function(formField, form, error){
        if(!form.attempted){
            form.attempted = false;
        }
        // error display if
        if(error == 'required'){
            return formField.$error.required && (formField.$dirty || form.attempted);
        }else if(error == 'min'){
            return formField.$error.minlength && (formField.$dirty || form.attempted);
        }else if(error == 'email'){
            return formField.$error.email && (formField.$dirty || form.attempted);
        }else if(error == 'datevalid'){
            return formField.$error.datevalid && ((form.month.$dirty && form.date.$dirty && form.year.$dirty)||form.attempted);
        }else if(error == 'unique'){
            return formField.$error.unique;
        }else if(error == 'pattern'){
            return formField.$error.pattern && (formField.$dirty || form.attempted);
        }else{
            return formField.$invalid && (formField.$dirty || form.attempted);
        }
    };
};

