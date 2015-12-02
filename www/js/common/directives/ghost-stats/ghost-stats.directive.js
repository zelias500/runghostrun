'use strict';

app.directive('ghostStats', function (TimeFactory, StatFactory) {
	return {
		scope: {
			data: '='
		},
		restrict: 'E',
		templateUrl: '/js/common/directives/ghost-stats/ghost-stats.html',
		link: function (scope) {

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
        	scope.distance = run.distance;
        	scope.averagePaceKm = StatFactory.minKm(run);
        	scope.averagePaceMi = StatFactory.minKm2minMi(scope.averagePaceKm);
        	return run;
    	}
	}
});
