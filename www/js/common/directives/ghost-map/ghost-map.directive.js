app.directive('ghostMap', function (MapFactory) {
	return {
		scope: {
			ghost: '=',
			anchors: '=', // whether or not clicking the map opens the challenge page
			boxes: '=' // whether or not we show info boxes
		},
		templateUrl: '/js/common/directives/ghost-map/ghost-map.html',
		restrict: 'E',
		link: function (scope) {
			// Note: this directive may take either a run or a ghost. The term 'ghost' is used interchangeably in this scope.
			// However, only maps that are completed (not meant to be updated) should be passed into this.

			scope.ghostUniqueId = scope.ghost._id + _.random(0, 1000, false)

			if (scope.anchors) scope.linksTo = "#/tab/ghost/" + scope.ghost._id
			else scope.linksTo = false;
        						
			// push rendering the gmap to the event queue to handle async loading of google maps
			setTimeout(function () {
				scope.map = MapFactory.newMap(scope.ghost, scope.ghostUniqueId, {
					centerOnInitialPosition: false,
					showPosition: false
				});
			}, 0);
		}
	}
});