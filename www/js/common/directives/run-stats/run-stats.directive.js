'use strict';

app.directive('runStats', function (TimeFactory, StatFactory) {
	return {
		scope: {
			data: '='
		},
		restrict: 'E',
		templateUrl: '/js/common/directives/run-stats/run-stats.html',
		link: function (scope) {
			
        	scope.calculateTime = function () {
        		if (scope.data) return TimeFactory.timeDisplay(scope.data.time);
        	}
        	scope.calculatePaceKm = function () {
        		if (scope.data) {
	        		scope.averagePaceKm = StatFactory.minKm(scope.data);
	        		return scope.averagePaceKm;
        		}
        	}
        	scope.calculatePaceMi = function () {
        		if (scope.data) {
	        		scope.averagePaceMi = StatFactory.minKm2minMi(scope.averagePaceKm);
	        		return scope.averagePaceMi;
        		}
        	}
        	scope.calculateDistance = function () {
        		if (scope.data) {
	        		scope.distance = scope.data.distance;
	        		return scope.distance;
        		}
        	}
    	}
	}
});
