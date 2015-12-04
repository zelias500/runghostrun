app.directive('runMap', function (MapFactory, $rootScope, $timeout, LocationFactory, $ionicLoading) {
	return {
		scope: {
			runData: '=',	// accepts run data from the location factory during an active run
			result: '=',	// accepts map data from the map factory post-run
			challenge: '='	// accepts a possible challenge ghost
		},
		templateUrl: '/js/common/directives/run-map/run-map.html',
		restrict: 'E',
		link: function (scope, el) {

			scope.runUniqueId = _.random(0, 1000000, false);

			// initialize a google map on the result state
			function initResult () {
				scope.map = scope.result;
				MapFactory.setCache(scope.map)
				MapFactory.configureGoogleMap(scope.runUniqueId, {});
				scope.map.drawEndPointMarkers();
			}

			// google maps initialization when challenging
			function initChallenge () {
				MapFactory.newMap(scope.challenge, scope.runUniqueId, {
					showPosition: false,
					centerOnInitialPosition: true,
					challengeGhost: scope.challenge
				}).then(function (map) {
					scope.map = map;
				}).then(null, function (err) {
					console.error(err);
				})
			}

			// google maps initialization when this is a brand new run
			function initNew () {
				MapFactory.newMap(scope.runData, scope.runUniqueId, {
					showPosition: true,
					centerOnInitialPosition: true
				}).then(function (map) {
					scope.map = map;
				}).then(null, function (err) {
					console.error(err);
				})
			}

			// google maps initialization before starting a new run
			function initEmpty () {
				MapFactory.newMap(null, scope.runUniqueId, {
					showPosition: true,
					centerOnInitialPosition: true
				}).then(function (map) {
					scope.map = map;
				}).then(null, function (err) {
					console.error(err);
				})
			}

			// process default google map
			if (scope.result) $timeout(initResult, 0);	// if we have a result map, render using initResult
			else {
				if (!scope.challenge) $timeout(initEmpty, 0);	// if about to start a new run, render the map with user's position
				if (scope.challenge) $timeout(initChallenge, 0)	// if about to challenge, render the map with the challenge route
			}

			// handling of events during an active run
			var start = $rootScope.$on('start', initNew);
			var startChallenge = $rootScope.$on('startChallenge', initChallenge);
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