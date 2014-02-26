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
    return{
        require: 'ngModel',
        restrict: 'EA',
        link: function(scope, element, attributes, ctrl){

            scope.$watch(function(){
                return ctrl.$viewValue;
            },function(value){
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

                scope.createForm.start.$setValidity('required', date1 ? true : false );
                scope.createForm.end.$setValidity('required', month1 ? true : false);
                scope.createForm.end.$setValidity('required', year1 ? true : false);
                scope.createForm.end.$setValidity('required', hour1 ? true : false);
                scope.createForm.end.$setValidity('required', minute1 ? true : false);
                scope.createForm.end.$setValidity('required', step1 ? true : false);


                var startTime = new Date();
                var endTime = new Date();
                var today = new Date();
                // create startTime
                    startTime.setDate(date1);
                    startTime.setFullYear(year1);
                    startTime.setMonth(month1);
                    startTime.setHours(hour1,minute1,0);
                    //set value for hour of startTime
                    if (step1 == "PM") {
                        startTime.setHours(startTime.getHours() + 12);
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
                if(startTime < today){
                    scope.createForm.date1.$setValidity('datevalid', true);
                    scope.createForm.month1.$setValidity('datevalid', true);
                    scope.createForm.year1.$setValidity('datevalid', true);
                    scope.createForm.hour1.$setValidity('datevalid', true);
                    scope.createForm.minute1.$setValidity('datevalid', true);
                    scope.createForm.step1.$setValidity('datevalid', true);
                }
            else{
                scope.createForm.date1.$setValidity('datevalid', false);
                scope.createForm.month2.$setValidity('datevalid', false);
                scope.createForm.year1.$setValidity('datevalid', false);
                scope.createForm.hour1.$setValidity('datevalid', false);
                scope.createForm.minute1.$setValidity('datevalid', false);
                scope.createForm.step1.$setValidity('datevalid', false);
            }
                if(startTime && date2 && year2 && month2 && hour2 && minute2 && step2){
                    // hide error of required fields
                    if(endTime>startTime){
                        scope.createForm.date2.$setValidity('datevalid', true);
                        scope.createForm.month2.$setValidity('datevalid', true);
                        scope.createForm.year2.$setValidity('datevalid', true);
                        scope.createForm.hour2.$setValidity('datevalid', true);
                        scope.createForm.minute2.$setValidity('datevalid', true);
                        scope.createForm.step2.$setValidity('datevalid', true);
                    }else{
                        scope.createForm.date2.$setValidity('datevalid', false);
                        scope.createForm.month2.$setValidity('datevalid', false);
                        scope.createForm.year2.$setValidity('datevalid', false);
                        scope.createForm.hour2.$setValidity('datevalid', false);
                        scope.createForm.minute2.$setValidity('datevalid', false);
                        scope.createForm.step2.$setValidity('datevalid', false);
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


