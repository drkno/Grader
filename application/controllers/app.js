(function () {
    'use strict';

    var app = angular.module('graderApp', [
        'ngRoute',
        'pageControllers'
    ]);

    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'application/views/grader.html',
                controller: 'GraderController'
            })
      }]);
}());
