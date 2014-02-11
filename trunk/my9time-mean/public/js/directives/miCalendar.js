/**
 * Created by Noir on 2/11/14.
 */
'use strict'

angular.module('my9time')
    .directive('devCalendar',['ui.config','$parse', devCalendar])
    .directive('inplace',inPlace);

function devCalendar(uiConfig, $parse){
    uiConfig.devCalendar = uiConfig.devCalendar || {};
    //returns the calendar
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            eventChanged: "=changed",
            events: "=ngModel"
        },
        link: function(scope, elm, $attrs) {
            var ngModel = $parse($attrs.ngModel);
            var editEvents = [];

            // event handler when mouseover
            function handlerOnMouseOver(event, jsEvent, view){
                if (view.name !== 'agendaDay') {
                    $(jsEvent.target).attr('title', event.title);
                }
            }
            // event handler when click
            function handlerOnClick(){
                console.log('im click on u');
            }
            // event handler when drop
            function handlerOnDrop(){
                console.log('im drop on u');
            }
            // event handler when resize
            function handlerOnResize(){
                console.log('im reszig on u');
            }
            //update the calendar with the correct options
            function update() {
                //IF the calendar has options added then render them.
                var expression,
                    options = {
                        header: {
                            left: 'prev,next today',
                            center: 'title',
                            right: 'month,agendaWeek,agendaDay'
                        },
                        // add event name to title attribute on mouseover.
                        eventClick: handlerOnClick,
                        eventDrop: handlerOnDrop,
                        eventResize: handlerOnResize,
                        eventMouseover: handlerOnMouseOver,
                        // Calling the events from the scope through the ng-model binding attribute.
                        events: ngModel(scope)
                    };

                if ($attrs.devCalendar) {
                    expression = scope.$eval($attrs.devCalendar);
                } else {
                    expression = {};
                }
                //Set the options from the directive's configuration
                angular.extend(options, uiConfig.devCalendar, expression);
                elm.html('').fullCalendar(options);
            }
            update();
            /*
             *
             *    This is where I get confused. Not sure why you can only watch events.length to update the scope accordingly. If events is watched The console blows to shreds and nothing happens.
             *
             *
             */
            scope.$watch( 'events.length', function( newVal, oldVal )
            {
                console.log( 'model changed:', newVal, oldVal );
                update();
            }, true );

        }
    };
}

function inPlace(){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            model: '=model',
            removeFn: '=onDelete',
            events: '=changed'
        },
        template: '<span>'+
            '<span class="c1" ng-hide="editorEnabled"'+
            'ng-click="enableEditor();">{{model}}</span>' +
            '<input ng-show="editorEnabled" ng-model="editModel"' +
            'ng-required ui-keypress="{13: \'unEdit()\'}"'+
            'ui-event="{\'blur\': \'unEdit()\'}"/>' +
            '</span>',
        // The linking function will add behavior to the template
        link: function(scope, element, attrs, $parent, $timeout) {
            scope.editorEnabled= false;

            scope.unEdit = function() {
                scope.model = angular.copy(scope.editModel);
                scope.editorEnabled= false;
            };

            scope.enableEditor= function() {
                scope.editModel = angular.copy(scope.model);
                scope.editorEnabled = true;
            };
        }
    }
}
