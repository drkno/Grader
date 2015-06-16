(function () {
    'use strict';

    var module = angular.module('pageControllers');

    module.controller('HeaderController', ['$scope', '$location',
        function ($scope, $location) {
            $scope.current = function (currLocation) {
                return $location.path().startsWith(currLocation);
            };
        }
    ]);

}());