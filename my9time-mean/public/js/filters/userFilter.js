/**
 * Created by Noir on 1/16/14.
 */
angular.module('my9time.user')
    .filter('numberFilter',function(){
        return function(input){
            if(!input) return 0;
            if(input>1000){
                return (input/1000) +'k';
            }
            return input;
        }
    })
    .filter('newlines',function(){
        return function(text){
            return text.replace(/\n/g, '<br/>');
        }
    })
    .filter('noHTML', function(){
        return function(text){
            if(!text){
                return '';
            }

            return text
                .replace(/&/g, '&amp;')
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;');
        }
    })
    .filter('dateTimeFilter', function(){
        return function(input,option){
            var date = new Date(input);
            // Nghĩa Sửa lại tí nè
            var step = "";
            if(date.getHours() > 12){
                step = "PM";
            }else step = "AM";
            switch(option){
                case 'date':
                    return date.getDate();
                case 'month':
                    return date.getMonth() + 1;
                case 'year':
                    return date.getFullYear();
                case 'hour':
                    return date.getHours();
                case 'minute':
                    return date.getMinutes();
                case 'step':
                    return step;
                case 'fullDate':
                    return date.getHours() + ':' + date.getMinutes() + ' ,' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
                case 'full':
                    return date.getHours() + ':' + date.getMinutes() + ' ,' + date.toDateString();
            }
        }
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
