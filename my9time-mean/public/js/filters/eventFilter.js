/**
 * Created by Nova on 2/12/14.
 */
angular.module('my9time.event')
    .filter('noHTML', function(){
        return function(input){
            if(!input){
                return '';
            }

            return input
                .replace(/&/g,'&amp;')
                .replace(/>/g,'&gt;')
                .replace(/</g,'&lt;');
        }
    })
    .filter('newlines', function(){
        return function(input){
            return input.replace(/\n/g, '<br/>');
        }
    })
    .filter('numberFilter',function(){
        return function(input){
            if(!input) return 0;

            if(input > 1000){
                return (input / 1000) + 'k';
            }
            return input;
        }
    })
    .filter('dateTimeFilter',function(){
        return function(input,option){
            var date = new Date(input);
            switch(option){
                case 'full':
                    return date.getHours() + ' : ' + date.getMinutes() + ' ,' + date.toDateString();
                case 'date':
                    return date.getDate();
                case 'month':
                    return date.getMonth()+1;
                case 'year':
                    return date.getFullYear();
            }
        };
    })
    .filter('shouldDisplayError', function(){
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