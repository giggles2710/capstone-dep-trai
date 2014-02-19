/**
 * Created by Nova on 2/19/14.
 */
angular.module('my9time.system')
    .directive('miDatetimePicker',['$http', MiDatetimePicker]);
 function MiDatetimePicker() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            recipient: '='
        },
        template:
            '<div>' +
                '<input type="text" readonly data-date-format="yyyy-mm-dd hh:ii" name="recipientDateTime" data-date-time required>'+
                '</div>',
        link: function(scope, element, attrs, ngModel) {
            var input = element.find('input');

            input.datetimepicker({
                format: "mm/dd/yyyy hh:ii",
                showMeridian: true,
                autoclose: true,
                todayBtn: true,
                todayHighlight: true
            });

            element.bind('blur keyup change', function(){
                scope.recipient.datetime = input.val();
            });
        }
    }
};