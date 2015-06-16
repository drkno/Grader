(function () {
    'use strict';

    var module = angular.module('pageControllers');

    module.controller('ResultController', ['$scope', '$http', '$routeParams', '$location',
        function ($scope, $http, $routeParams, $location) {
            $scope.loaded = false;
            $scope.pollResults = undefined;
            $scope.chartLabels = undefined;
            $scope.chartValues = undefined;
            $scope.resetWarning = false;
            $scope.deleteWarning = false;

            $scope.getAnswers = function() {
                var result = [];
                if (!$scope.pollResults) return result;
                for (var i = 0; i < $scope.pollResults.votes.length; i++) {
                    result.push($scope.pollResults.votes[i].answer);
                }
                return result;
            };

            $scope.getVotes = function() {
                var result = [];
                if (!$scope.pollResults) return result;
                for (var i = 0; i < $scope.pollResults.votes.length; i++) {
                    result.push($scope.pollResults.votes[i].votes);
                }
                return result;
            };

            $scope.navigate = function(location) {
                switch (location) {
                    case 'back': $location.path('/results'); break;
                    case 'modify': $location.path('/modify/' + $routeParams.pollId); break;
                    default: $location.path(location); break;
                }
            };

            $scope.reset = function() {
                var resetRestUrl = 'index.php/services/votes/' +
                    $routeParams.pollId + '?callback=JSON_CALLBACK';
                $http.delete(resetRestUrl)
                    .success(function(data) {
                        $scope.loaded = false;
                        $scope.chartValues = undefined;
                        $scope.getPollData();
                    })
                    .error(function(data, status, headers, config) {
                        console.log("Error resetting poll. Status was " + status + ".");
                        alert("Could not reset poll!");
                    }
                );
            };

            $scope.delete = function() {
                var deleteRestUrl = 'index.php/services/polls/' +
                    $routeParams.pollId + '?callback=JSON_CALLBACK';
                $http.delete(deleteRestUrl)
                    .success(function(data) {
                        $scope.navigate("back");
                    })
                    .error(function(data, status, headers, config) {
                        console.log("Error deleting poll. Status was " + status + ".");
                        alert("Could not delete poll!");
                    }
                );
            };

            $scope.getPollData = function() {
                var votesRestUrl = 'index.php/services/votes/' +
                    $routeParams.pollId + '?callback=JSON_CALLBACK';
                $http.jsonp(votesRestUrl)
                    .success(function(data) {
                        $scope.loaded = true;
                        $scope.pollResults = data;
                        $scope.chartValues = $scope.getVotes();
                        $scope.chartLabels = $scope.getAnswers();
                    })
                    .error(function(data, status, headers, config) {
                        console.log("Error loading poll results. Status was " + status + ".");
                        $scope.loadingMessage = "An error occurred while loading the poll results. Does it exist?";
                    }
                );
            };

            $scope.getPollData();
        }
    ]);
}());