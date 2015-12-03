app.directive('runMap', function (MapFactory, $rootScope, $timeout, LocationFactory) {
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

			function createGoogleMap () {
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
							resolve(gmap);
						});
					}
				})
			}

			// google maps initialization when challenging, or viewing a result
			function initExisting () {
				scope.map = scope.result || MapFactory.newMap(scope.challenge);
				console.log('map', scope.map)
				createGoogleMap()
				.then(function () {
					if (scope.result) {
			        	scope.map.makePolyline();
			        	scope.map.runPath.setMap(gmap);
					}
		        	if (scope.challenge) {
		        		scope.map.wayPoints = [];
		        		scope.map.makeOtherPolyline(scope.challenge);
		        		scope.map.existingPath.setMap(gmap);
		        	}
		            gmap.fitBounds(scope.map.bounds);
				})
			}

			// google maps initialization when this is a brand new run
			function initNew () {
				scope.map = MapFactory.newMap(scope.runData);
				createGoogleMap()
				.then(function () {
		        	scope.map.makePolyline();
		        	scope.map.runPath.setMap(gmap);
		            gmap.fitBounds(scope.map.bounds);
				})
			}

			// process the google map for the result
			if (scope.result) $timeout(initExisting, 0);

			// handling of events during an active run
			var start = $rootScope.$on('start', initNew);
			var startChallenge = $rootScope.$on('startChallenge', initExisting);
			var tick = $rootScope.$on('tick', function () {

				if (scope.runData.locations && (scope.runData.locations.length > scope.map.wayPoints.length)) {
                	var lastLocation = scope.runData.locations[scope.runData.locations.length - 1];
	                scope.map.addWayPoint({
	                    lat: Number(lastLocation.lat),
	                    lng: Number(lastLocation.lng)
	                })
	                gmap.fitBounds(scope.map.bounds);
	            }
	            scope.map.makePolyline();
	            scope.map.runPath.setMap(gmap);
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