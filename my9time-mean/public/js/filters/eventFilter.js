/**
 * Created by Nova on 2/12/14.
 */
angular.module('my9time.event')
    .filter('eventFilter', function(){
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
            }else if(error == 'daterequired'){
                return formField.$error.daterequired && ((form.date1.$dirty && form.month1.$dirty && form.year1.$dirty
                    && form.hour1.$dirty && form.minute1.$dirty && form.step1.$dirty)||form.attempted);
            }else if(error == 'validStart'){
                return formField.$error.validStart && ((form.date1.$dirty && form.month1.$dirty && form.year1.$dirty
                    && form.hour1.$dirty && form.minute1.$dirty && form.step1.$dirty)||form.attempted);
            }else if(error == 'validEnd'){
                return formField.$error.validEnd && ((form.date2.$dirty && form.month2.$dirty && form.year2.$dirty
                    && form.hour2.$dirty && form.minute2.$dirty && form.step2.$dirty)||form.attempted);
            }else if(error == 'unique'){
                return formField.$error.unique;
            }else if(error == 'pattern'){
                return formField.$error.pattern && (formField.$dirty || form.attempted);
            }else{
                return formField.$invalid && (formField.$dirty || form.attempted);
            }
        };
    })