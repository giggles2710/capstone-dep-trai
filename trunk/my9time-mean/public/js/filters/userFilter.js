/**
 * Created by Noir on 1/16/14.
 */
angular.module('my9time.filter')
    .filter('participantFilter',function(){
        return function(participants,option){
            if(!participants) return;
            switch(option){
                case 'length':
                    if(participants.length == 0) return 0;
                    var total = participants.length;
                    for(var i=0;i<participants.length;i++){
                        if(participants[i].status.indexOf('waiting')>-1){
                            total--;
                        }
                    }
                    return total;
                case 'full':
                    if(participants.length == 0) return [];
                    for(var i=0;i<participants.length;i++){
                        if(participants[i].status.indexOf('waiting')>-1){
                            // splice it
                            participants.splice(i,1);
                            // -- i
                            --i;
                        }
                    }
                    return participants;
            }
        }
    })
    .filter('whoAmIFilter',['UserSession',function(Global){
        return function(input){
            if(input == Global.userId){
                return 'm-c-item-me';
            }
            return 'm-c-item-you';
        }
    }])
    .filter('timeAgoFilter',function(){
        return function(input){
            var date = new Date(input);
            var interval = new Date() - date;
            var seconds = Math.round(interval/1000);
            var minutes = Math.round(interval/1000/60);
            var hours = Math.round(interval/1000/60/60);

            if(seconds < 60){
                return seconds + ' seconds ago';
            }else if(minutes < 60){
                return minutes + ' minutes ago';
            }else if(hours < 24){
                return hours + ' hours ago';
            }else{
                return date.getHours() + ':' + date.getMinutes() + ' ,' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
            }
        }
    })
    .filter('getUnreadCount',function(){
        return function(input){
            if(!input) return 0;
            var count = 0;
            for(var i=0;i<input.length;i++){
                if(!input[i].isRead){
                    count++;
                }
            }
            return count;
        }
    })
    .filter('numberFilter',function(){
        return function(input){
            if(!input) return 0;
            if(input>1000){
                return (input/1000) +'k';
            }
            return input;
        }
    })
    .filter('participantArrayToString',function(){
        return function(input){
            var output = '';
            for(var i=0;i<input.length;i++){
                output+= input[i].username;
                if(i<input.length-1){
                    output+=' ,';
                }
            }
            return output;
        }
    })
    .filter('newlines',function(){
        return function(text){
            return text.replace(/\n/g, '<br/>');
        }
    })
    .filter('upperCase',function(){
        return function(input){
            if(input){
                var words = input.split(" ");
                var arr = Array();
                for (var i in words)
                {
                    var temp = words[i].toLowerCase();
                    temp = temp.charAt(0).toUpperCase() + temp.substring(1);
                    arr.push(temp);
                }
                return arr.join(" ");
            }
            else{
                return input;
            }



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
    .filter('multiUserOnNotification',function(){
        return function(senders){
            var output = senders[0];
            for(var i=1;i<senders.length;i++){
                if(i==(senders.length-1)){
                    output += ' and ' + senders[i];
                }else{
                    output += ', ' + senders[i];
                }
            }
            return output;
        }
    })
    .filter('dateTimeFilter', function(){
        return function(input,option){
            if(!input){
                return '???';
            }
            var date = new Date(input);
            // Nghĩa Sửa lại tí nè
            var step = "";
            if(date.getHours() > 12){
                step = "PM";
            }else step = "AM";
            // for toDateString error
            var date1 = new Date();
            var day = date.getDate();
            var month = date.getMonth()-1;
            var year = date.getFullYear();
            var date1 = new Date(year,month,day);
            if(!isNaN(date1.getTime())){
                switch(option){
                    case 'date':
                        return date.getDate();
                    case 'month':
                        return date.getMonth();
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
                        return date.getHours() + ':' + date.getMinutes() + ' ,' + date1.toDateString();
                    case 'onlyDate':
                        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                }
            }else{
                return 'N/A';
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
