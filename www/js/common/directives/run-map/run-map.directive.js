app.directive('runMap', function (MapFactory, $rootScope, $timeout) {
	return {
		scope: {
			runData: '=',	// accepts run data from the location factory during an active run
			result: '=',	// accepts map data from the map factory post-run
			challenge: '=',	// accepts a possible challenge ghost
			ghost: '=',		// accepts a ghost or run data for a completed ghost
			mapHeight: '=',
			clickable: '='	// accepts a boolean for whether to link to the challenge page
		},
		templateUrl: '/js/common/directives/run-map/run-map.html',
		restrict: 'E',
		link: function (scope) {

			if (!scope.mapHeight) scope.mapHeight = {height:'300px'};

			scope.runUniqueId = _.random(0, 1000000, false);

			// initialize a google map on the result state
			function initResult () {
				scope.map = scope.result;
				MapFactory.setCache(scope.map)
				MapFactory.configureGoogleMap(scope.runUniqueId, {
					drawEndPoints: true
				});
			}

			function initialize(data, centerOnInitialPosition, showPosition, drawEndPoints, challengeGhost) {
				MapFactory.newMap(data, scope.runUniqueId, {
					centerOnInitialPosition: centerOnInitialPosition,
					showPosition: showPosition,
					drawEndPoints: drawEndPoints,
					challengeGhost: challengeGhost
				}).then(function (map) {
					scope.map = map;
				}).then(null, function (err) {
					console.error(err);
				});
			}

			if (scope.clickable && scope.ghost.ghost) scope.address = "#/tab/ghost/" + scope.ghost.ghost._id; // in case we pass in a run
			else if (scope.clickable) scope.address = "#/tab/ghost/" + scope.ghost._id;
			else scope.address = false;

			// process default google map
			if (scope.result) $timeout(initResult, 0);	// if we have a result map, render using initResult
			else if (scope.ghost) $timeout(() => {
				initialize(scope.ghost, false, false, true, false);
			}, 0);
			else if (!scope.challenge) $timeout(() => {
				initialize(null, true, true, false, false);
			}, 0);	// if about to start a new run, render the map with user's position
			else if (scope.challenge) $timeout(() => {
				initialize(scope.challenge, true, false, false, scope.challenge);
			}, 0)	// if about to challenge, render the map with the challenge route


			// handling of events during an active run
			var start = $rootScope.$on('start', () => {
				initialize(scope.runData, true, true, false, false);
			});
			var startChallenge = $rootScope.$on('startChallenge', () => {
				initialize(scope.challenge, true, false, false, scope.challenge);
			});
			var tick = $rootScope.$on('tick', function () {
				scope.map.tick(scope.runData)
			});

			scope.$on('$destroy', function () {
				// unregister event listening
				if (start) start();
				if (startChallenge) startChallenge();
				if (tick) tick();
			})
		}
	}
});