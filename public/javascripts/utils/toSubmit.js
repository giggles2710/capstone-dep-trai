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
        }

    };
};