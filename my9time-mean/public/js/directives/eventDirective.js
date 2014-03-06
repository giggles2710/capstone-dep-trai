/**
 * Created by Nova on 2/13/14.
 */
angular.module('my9time')
    .directive('miSubmitEvent',['$parse', MiSubmitEventDirective])
    .directive('miCheckUniqueName',['$http', MiCheckUniqueNameDirective])
    .directive('miCheckDate', MiDateCheckDirective);

function MiCheckUniqueNameDirective($http){
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
    alert("checkDate");
    return{
        require: 'ngModel',
        restrict: 'EA',
        link: function(scope, element, attributes, ctrl){

            var date1 = scope.createForm.date1.$viewValue;
            var month1 =scope.createForm.month1.$viewValue;
            var year1 = scope.createForm.month2.$viewValue;
            var hour1= scope.createForm.hour1.$viewValue;
            var minute1 = scope.createForm.minute1.$viewValue;
            var step1 = scope.createForm.step1.$viewValue;
            var date2 = scope.createForm.date1.$viewValue;
            var month2 =scope.createForm.month1.$viewValue;
            var year2 = scope.createForm.month2.$viewValue;
            var hour2 = scope.createForm.hour1.$viewValue;
            var minute2 = scope.createForm.minute1.$viewValue;
            var step2 = scope.createForm.step2.$viewValue;

            scope.$watch(function(){
                return ctrl.$viewValue;
            },function(value){
                // user have to input startDate
                // set validity of date1 Once whatever value in startTime is null
                scope.createForm.date1.$setValidity('daterequired', date1 ? true : false );
                scope.createForm.date1.$setValidity('daterequired', month1 ? true : false);
                scope.createForm.date1.$setValidity('daterequired', year1 ? true : false);
                scope.createForm.date1.$setValidity('daterequired', hour1 ? true : false);
                scope.createForm.date1.$setValidity('daterequired', minute1 ? true : false);
                scope.createForm.date1.$setValidity('daterequired', step1 ? true : false);

                // initiate startTime, endTime, today
                var startTime = new Date();
                var endTime = new Date();
                var today = new Date();

                // create startTime
                if (date1 && year1 && month1 && hour1 && minute1 && step1) {
                    startTime.setDate(date1);
                    startTime.setFullYear(year1);
                    startTime.setMonth(month1);
                    startTime.setHours(hour1,minute1,0);
                    //set value for hour of startTime
                    if (step1 == "PM") {
                        startTime.setHours(startTime.getHours() + 12);
                    }
                }

                // create endTime
                if (date2 && year2 && month2 && hour2 && minute2 && step2) {
                    //set endTime
                    endTime.setDate(date2);
                    endTime.setFullYear(year2);
                    endTime.setMonth(month2);
                    endTime.setHours(hour2, minute2, 0);
                    //set value for hour of startTime
                    if (req.body.step2 == "PM") {
                        endTime.setHours(endTime.getHours() + 12);
                    }
                }

                // StartTime has to greater than today
                if (date1 && year1 && month1 && hour1 && minute1 && step1) {
                    if(startTime < today){
                        scope.createForm.date1.$setValidity('validStart', true);
                        scope.createForm.month1.$setValidity('validStart', true);
                        scope.createForm.year1.$setValidity('validStart', true);
                        scope.createForm.hour1.$setValidity('validStart', true);
                        scope.createForm.minute1.$setValidity('validStart', true);
                        scope.createForm.step1.$setValidity('validStart', true);
                    }
                    else{
                        scope.createForm.date1.$setValidity('validStart', false);
                        scope.createForm.month1.$setValidity('validStart', false);
                        scope.createForm.year1.$setValidity('validStart', false);
                        scope.createForm.hour1.$setValidity('validStart', false);
                        scope.createForm.minute1.$setValidity('validStart', false);
                        scope.createForm.step1.$setValidity('validStart', false);
                    }
                }

                //endTime has to greater than startTime
                if(date1 && year1 && month1 && hour1 && minute1 && step1 && date2 && year2 && month2 && hour2 && minute2 && step2){
                    if(endTime>startTime){
                        scope.createForm.date2.$setValidity('validEnd', true);
                        scope.createForm.month2.$setValidity('validEnd', true);
                        scope.createForm.year2.$setValidity('validEnd', true);
                        scope.createForm.hour2.$setValidity('validEnd', true);
                        scope.createForm.minute2.$setValidity('validEnd', true);
                        scope.createForm.step2.$setValidity('validEnd', true);
                    }else{
                        scope.createForm.date2.$setValidity('validEnd', false);
                        scope.createForm.month2.$setValidity('validEnd', false);
                        scope.createForm.year2.$setValidity('validEnd', false);
                        scope.createForm.hour2.$setValidity('validEnd', false);
                        scope.createForm.minute2.$setValidity('validEnd', false);
                        scope.createForm.step2.$setValidity('validEnd', false);
                    }
                }
            });
        }
    }
}

function MiSubmitEventDirective($parse){
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


