app.directive('runMap', function (MapFactory, $rootScope, $timeout, LocationFactory) {
	return {
		scope: {
			runData: '=',	// accepts run data from the location factory during an active run
			result: '='		// accepts map data from the map factory post-run
		},
		templateUrl: '/js/common/directives/run-map/run-map.html',
		restrict: 'E',
		link: function (scope) {

			scope.runUniqueId = _.random(0, 1000000, false);
			var gmap;

			// process the google map image after a run
			if (scope.result) {

				function initResultMap () {
					scope.map = scope.result;
					gmap = new google.maps.Map(document.getElementById(scope.runUniqueId), {
			            zoom: 12,
			            mapTypeId: google.maps.MapTypeId.TERRAIN,
			            disableDefaultUI: true,
			            draggable: false,
			            styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}],
			            center: new google.maps.LatLng(scope.map.wayPoints[0].lat, scope.map.wayPoints[0].lng)
		        	})
		        	scope.map.makePolyline();
		        	scope.map.runPath.setMap(gmap);
		            gmap.fitBounds(scope.map.bounds);
				}

				$timeout(initResultMap, 0);
			}

			function initialize () {
				scope.map = MapFactory.newMap(scope.runData);
				var initialLocation;
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
					})
				}
			  	gmap = new google.maps.Map(document.getElementById(scope.runUniqueId), {
		            zoom: 12,
		            mapTypeId: google.maps.MapTypeId.TERRAIN,
		            disableDefaultUI: true,
		            draggable: false,
		            styles: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}],
		            center: initialLocation
	        	})
	        	scope.map.makePolyline();
	        	scope.map.runPath.setMap(gmap);
	            gmap.fitBounds(scope.map.bounds);
			}

			// handling of events during an active run
			$rootScope.$on('start', initialize);

			$rootScope.$on('tick', function () {
				if (scope.runData.locations.length > scope.map.wayPoints.length) {
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
		}
	}
});