/**
 * Created by Noir on 1/16/14.
 */
angular.module('my9time.user').filter('shouldDisplayError', function(){
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
});
