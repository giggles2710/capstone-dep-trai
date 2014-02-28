/**
 * Created by Noir on 2/28/14.
 */

angular.module('my9time.event')
    .controller('popupMessageController',['$scope','$http',''])
var query = '/api/getFriendToken/'+scope.$parent.global.userId+'/'+scope.eventId;
$('input.token-input').tokenInput(
    query,
    {
        theme:'facebook',
        hintText:"Type in your friend's name",
        noResultsText: "No friend is matched."
    }
).removeClass('empty');