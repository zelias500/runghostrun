'use strict';

app.directive('ghostStats', function (TimeFactory, StatFactory, SettingFactory) {
	return {
		scope: {
			data: '='
		},
		restrict: 'E',
		templateUrl: '/js/common/directives/ghost-stats/ghost-stats.html',
		link: function (scope) {
			if (!scope.data) return;

			var run = scope.data;
		    function parseDisplayDate(date) {
		        return new Date(date)
	        	.toString()
	        	.split(' ')
	        	.slice(0, 4)
	        	.join(' ');
		    }

        	run.timestamp = Date.parse(run.timestamp);

        	scope.displayTime = TimeFactory.timeDisplay(run.time);
        	scope.displayDate = parseDisplayDate(run.timestamp);
        	scope.distanceKm = Number((run.distance / 1000).toFixed(2));
        	scope.distanceMi = StatFactory.convertDistanceMetricToMiles(scope.distanceKm);
        	scope.averagePaceKm = StatFactory.calculatePaceKilometers(run);
        	scope.averagePaceMi = StatFactory.convertPaceMetricToMiles(scope.averagePaceKm);

            if (SettingFactory.getUnit() == 'km') scope.useKm = true;
            if (SettingFactory.getUnit() =='mi') scope.useMi = true;
            
        	return run;
    	}
	}
});
