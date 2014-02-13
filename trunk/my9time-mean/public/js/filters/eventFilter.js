/**
 * Created by Nova on 2/12/14.
 */
angular.module('my9time.event').filter('shouldDisplayError', function(){
    return function(formField, form, error){
        if(!form.attempted){
            form.attempted = false;
        }
        // error display if
        if(error == 'required'){
            return formField.$error.required && (formField.$dirty || form.attempted);
        }else if(error == 'min'){
            return formField.$error.minlength && (formField.$dirty || form.attempted);
        }else if(error == 'max'){
            return formField.$error.maxlenghth && (formField.$dirty || form.attempted);
        }else if(error == 'datevalid'){
            return formField.$error.datevalid && ((form.start.$dirty && form.end.$dirty )||form.attempted);
        }else if(error == 'unique'){
            return formField.$error.unique;
        }else if(error == 'pattern'){
            return formField.$error.pattern && (formField.$dirty || form.attempted);
        }else{
            return formField.$invalid && (formField.$dirty || form.attempted);
        }
    };
});