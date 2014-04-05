requirejs({
    "baseUrl": "/",
    "paths": {
        "angular": "lib/angular/angular",
        "jquery": "lib/jquery/jquery",
        "ngResource": 'lib/angular-resource/angular-resource',
        "app": "js/app",
        'angularAnimate': 'lib/angular-animate/angular-animate'
    },
    "shim": {
        "jquery": {"exports": "jquery"},
        "angular": {
            "deps": ["jquery"],
            "exports": "angular"
        },
        "ngResource": {
            "deps": ["angular"],
            exports: "ngResource"
        },
        "angularAnimate": {
            "deps": ['angular']
        }
    },
    priority: [
        "angular"
    ]

});

require(['jquery', 'angular'], function ($, angular) {
    $(function () {
        angular.bootstrap(document, ['my9time']);
    });
});

