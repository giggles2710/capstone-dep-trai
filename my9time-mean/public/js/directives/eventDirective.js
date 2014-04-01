/**
 * Created by Nova on 2/13/14.
 */
angular.module('my9time')
    .directive('miSubmitEvent', ['$parse', MiSubmitEventDirective])
    .directive('miCheckUniqueName', ['$http', MiCheckUniqueNameDirective])
    .directive('miCheckDate', MiDateCheckDirective);

function MiCheckUniqueNameDirective($http) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            scope.$watch(function () {
                return ctrl.$viewValue;
            }, function (value) {
                if (!ctrl.$invalid) {
                    $http({
                        method: 'POST',
                        url: '/api/checkUniqueName',
                        data: $.param({target: value}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .success(function (data, status) {
                            ctrl.$setValidity('unique', true);
                        })
                        .error(function (data, status) {
                            ctrl.$setValidity('unique', false);
                        });
                } else {
                    ctrl.$setValidity('unique', true);
                }
            });
        }
    }
}

function MiDateCheckDirective() {
    return{
        require: 'ngModel',
        restrict: 'EA',
        link: function (scope, element, attributes, ctrl) {
            scope.$watch(function () {
                return ctrl.$viewValue;
            }, function (value) {
                var date1 = scope.createForm.date1.$viewValue;
                var month1 = scope.createForm.month1.$viewValue;
                var year1 = scope.createForm.year1.$viewValue;
                var hour1 = scope.createForm.hour1.$viewValue;
                var minute1 = scope.createForm.minute1.$viewValue;
                var step1 = scope.createForm.step1.$viewValue;
                var date2 = scope.createForm.date2.$viewValue;
                var month2 = scope.createForm.month2.$viewValue;
                var year2 = scope.createForm.year2.$viewValue;
                var hour2 = scope.createForm.hour2.$viewValue;
                var minute2 = scope.createForm.minute2.$viewValue;
                var step2 = scope.createForm.step2.$viewValue;

                // initiate startTime, endTime, today
                var startTime = new Date();
                var endTime = new Date();
                var isValidStart = false;
                var isValidEnd = false;

                // user have to input startDate
                if(date1 && month1 && year1 && hour1 && (minute1 || minute1=='0')){
                if (!isNaN(date1) && !isNaN(month1) && !isNaN(year1) && !isNaN(hour1) && ((!isNaN(minute1)) || minute1 == '0')) {
                    scope.createForm.date1.$setValidity('validStart', true);
                    isValidStart = true;
                    // create startTime
                    startTime.setDate(date1);
                    startTime.setFullYear(year1);
                    startTime.setMonth(month1);
                    startTime.setHours(hour1, minute1, 0);
                    //set value for hour of startTimeS
                    if (step1 == "PM") {
                        startTime.setHours(startTime.getHours() + 12);
                    }
                }
                }
                else {
                    scope.createForm.date1.$setValidity('validStart', false);
                }
                if(date2 && month2 && year2 && hour2 && (minute2 || minute2 == '0')){
                if (!isNaN(date2) && !isNaN(month2) && !isNaN(year2) && !isNaN(hour2) && ((!isNaN(minute2)) || minute2 == '0')) {
                    isValidEnd = true;
                    //set endTime
                    endTime.setDate(date2);
                    endTime.setFullYear(year2);
                    endTime.setMonth(month2);
                    endTime.setHours(hour2, minute2, 0);
                    //set value for hour of EndTime
                    if (step2 == "PM") {
                        endTime.setHours(endTime.getHours() + 12);
                    }
                }
                }

                if (isValidStart && isValidEnd) {
                    //endTime has to greater than startTime
                    if (endTime > startTime) {
                        scope.createForm.date2.$setValidity('validEnd', true);
                    } else {
                        scope.createForm.date2.$setValidity('validEnd', false);
                    }
                }


            });
        }
    }
}

function MiSubmitEventDirective($parse) {
    return{
        restrict: 'EA',
        link: function (scope, element, attributes) {
            // $parse to get function login()
            var submitFunction = $parse(attributes.miSubmit);

            element.bind('submit', function () {
                scope.$apply(function () {
                    // we try to submit the form
                    // setting attempted to true to make the errors displayable

                    scope[attributes.name].attempted = true;
                });
                // if form is not valid cancel it
                if (!scope[attributes.name].$valid) {
                    return false;
                }

                // form valid, final submit
                scope.$apply(function () {
                    // execute login()
                    submitFunction(scope, {$event: event});
                });
            });
        }
    }
}


