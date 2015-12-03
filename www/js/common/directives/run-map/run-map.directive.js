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
			var gmap;

			// creates and renders a google map.
			// takes an optional parameter to show the user's current position with a marker
			function createGoogleMap (showPosition) {
				$ionicLoading.show();
				return new Promise(function (resolve, reject) {
					var initialLocation;
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function (position) {
							initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
							gmap = new google.maps.Map(document.getElementById(scope.runUniqueId), {
					            zoom: 15,
					            mapTypeId: google.maps.MapTypeId.TERRAIN,
					            disableDefaultUI: true,
					            draggable: false,
					            styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}],
					            center: initialLocation
				        	});
							if (showPosition) {
								var marker = new google.maps.Marker({
									position: initialLocation,
									map: gmap
								})
								marker.setMap(gmap);
							}
							$ionicLoading.hide();
							resolve(gmap);
						});
					} else console.error('Unable to get geolocation')
				})
			}

			function drawAndSetPolyline () {
				scope.map.makePolyline();
			    scope.map.runPath.setMap(gmap);
			}

			// initialize a google map on the result state
			function initResult () {
				scope.map = scope.result;
				createGoogleMap()
				.then(function () {
			        drawAndSetPolyline();
			        gmap.fitBounds(scope.map.bounds);
			    })
			}

			// google maps initialization when challenging
			function initChallenge () {
				scope.map = MapFactory.newMap(scope.challenge);
				createGoogleMap()
				.then(function () {
		        	scope.map.wayPoints = [];
		        	scope.map.makeOtherPolyline(scope.challenge);
		        	scope.map.existingPath.setMap(gmap);
		            gmap.fitBounds(scope.map.bounds);
				})
			}

			// google maps initialization when this is a brand new run
			function initNew () {
				scope.map = MapFactory.newMap(scope.runData);
				createGoogleMap()
				.then(function () {
		        	drawAndSetPolyline();
		            gmap.fitBounds(scope.map.bounds);
				})
			}

			// google maps initialization before starting a new run
			function initEmpty () {
				scope.map = MapFactory.newMap();
				createGoogleMap(true)
				.then(function () {
					MapFactory.clearCache();
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

				if (scope.runData.locations && (scope.runData.locations.length > scope.map.wayPoints.length)) {
                	var lastLocation = scope.runData.locations[scope.runData.locations.length - 1];
	                scope.map.addWayPoint({
	                    lat: Number(lastLocation.lat),
	                    lng: Number(lastLocation.lng)
	                })
	                gmap.fitBounds(scope.map.bounds);
	            }
	            drawAndSetPolyline();
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