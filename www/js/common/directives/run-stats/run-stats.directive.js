'use strict';

app.directive('runStats', function (TimeFactory, StatFactory, SettingFactory, Session) {
	return {
		scope: {
			data: '=',
            format: '='
		},
		restrict: 'E',
		templateUrl: '/js/common/directives/run-stats/run-stats.html',
		link: function (scope) {

            if (scope.data) scope.displayDate = TimeFactory.parseDisplayDate(scope.data.timestamp);
            if (!scope.format) scope.format === 'col';
			
        	scope.calculateTime = function () {
        		if (scope.data) return TimeFactory.timeDisplay(scope.data.time);
        	}
        	scope.calculatePaceKm = function () {
        		if (scope.data) {
	        		scope.averagePaceKm = StatFactory.calculatePaceKilometers(scope.data);
	        		return scope.averagePaceKm;
        		}
        	}
        	scope.calculatePaceMi = function () {
        		if (scope.data) {
	        		scope.averagePaceMi = StatFactory.convertPaceMetricToMiles(scope.averagePaceKm);
	        		return scope.averagePaceMi;
        		}
        	}
        	scope.calculateDistanceKm = function () {
        		if (scope.data) {
	        		scope.distance = Number((scope.data.distance / 1000).toFixed(3));
	        		return scope.distance;
        		}
        	}
            scope.calculateDistanceMi = function () {
                if (scope.data) {
                    scope.distance = StatFactory.convertDistanceMetricToMiles(scope.data.distance / 1000);
                    return scope.distance;
                }
            }

            if (Session.user.isMetric) scope.useKm = true;
            else scope.useMi = true;
    	}
	}
});
