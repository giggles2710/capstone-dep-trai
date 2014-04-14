/**
 * Created by Noir on 4/13/14.
 */
'use strict'

angular.module('my9time')
    .directive('facebookShare',['$http', facebookShareDirective]);

function facebookShareDirective($http){
    return {
        restrict: 'EA',
        templateUrl: '/views/component/facebookShareButton.html',
        link: function(scope, element, attributes){
            $('#share_button').click(function(e){
                e.preventDefault();
                console.log('heello');
                FB.ui(
                    {
                        method: 'feed',
                        name: 'This is the content of the "name" field.',
                        link: ' http://www.hyperarts.com/',
                        picture: 'http://www.hyperarts.com/external-xfbml/share-image.gif',
                        caption: 'This is the content of the "caption" field.',
                        description: 'This is the content of the "description" field, below the caption.',
                        message: ''
                    });
            });
        }
    }
}