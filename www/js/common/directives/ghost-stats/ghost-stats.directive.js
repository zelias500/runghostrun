'use strict';

app.directive('ghostStats', function (TimeFactory) {
	return {
		scope: {
			data: '='
		},
		restrict: 'E',
		templateUrl: '/js/common/directives/ghost-stats/ghost-stats.html',
		link: function (scope){
			scope.displayTime = function(){
				return TimeFactory.timeDisplay(scope.data.time);
			}
			scope.findDistance = function(){
				return Number(scope.data.distance.toFixed(2));
			}
			scope.findAvgPace = function(){
				return scope.data.avgPace;
			}
		}
	}
});
