app.factory('MapFactory', function ($ionicLoading) {
	var factory = {};

	const mapStyle = [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}];

	var cachedMap = undefined;

	factory.getMap = function () {
		return cachedMap;
	}

	factory.clearCache = function () {
		cachedMap = undefined;
	}

	factory.setCache = function (mapData) {
		cachedMap = mapData;
	}

	factory.configureGoogleMap = function (elementId, options) {
		var initialLocation;
		$ionicLoading.show();
		
		function getGeoPosition () {
			return new Promise(function (resolve, reject) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (position) {
						if (position) {
							var coordinates = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
							cachedMap.bounds.extend(coordinates);
							resolve(coordinates);
							
						} else reject(new Error('Could not get current position'));
					});
				} else reject (new Error('Navigator is not available'));
			});
		}
		
		function createMap () {
			cachedMap.gmap = new google.maps.Map(document.getElementById(elementId), {
		            zoom: 15,
		            mapTypeId: google.maps.MapTypeId.TERRAIN,
		            disableDefaultUI: true,
		            draggable: false,
		            styles: mapStyle,
		            center: initialLocation
	        	});

			if (options.showPosition) {
				var marker = new google.maps.Marker({
					position: initialLocation,
					map: cachedMap.gmap
				})
				marker.setMap(cachedMap.gmap);
			}

			if (options.challengeGhost) {
				cachedMap.wayPoints = [];
    			cachedMap.makeOtherPolyline(options.challengeGhost);
    			cachedMap.existingPath.setMap(cachedMap.gmap);
        		cachedMap.gmap.fitBounds(cachedMap.bounds);
			} else cachedMap.drawAndSetPolyline();

			$ionicLoading.hide();
			return cachedMap;
		};

		return new Promise(function (resolve, reject) {
			if (options.centerOnInitialPosition) {
				getGeoPosition().then(function(coords) {
					initialLocation = coords;
					resolve(createMap());
				})
			} else {
				options.initialLocation = new google.maps.LatLng(cachedMap.wayPoints[0].lat, cachedMap.wayPoints[0].lng);
				resolve(createMap());
			}
		});
	}

	// returns a new map instance from the entered ghost data
	factory.newMap = function (ghost, elementId, options) {

		// helper function to coerce lat and lng to Numbers from strings
		function makeWayPoints (ghost) {
			return ghost.locations.map(loc => {
				return {
		                lat: Number(loc.lat),
		                lng: Number(loc.lng)
            		}
            });
		}

		// Map constructor function - if no ghost, returns empty map
		function Map (ghost) {
			if (ghost) {
				// for our own benefit - may remove eventually
				this.id = ghost._id;
				this.ghost = ghost;

				this.wayPoints = makeWayPoints(ghost);
			} else this.wayPoints = [];

			this.bounds = new google.maps.LatLngBounds();
			this.makePolyline(); // sets this.runPath, which contains a google maps Polyline
			this.wayPoints.forEach(loc => {
				loc = new google.maps.LatLng(loc.lat, loc.lng)
				this.bounds.extend(loc);
			});
		}

		// waypoints is an array of location object objects with lat and lng properties
		Map.prototype.addWayPoint = function(location) {
			var position = new google.maps.LatLng(location.lat, location.lng);
			this.bounds.extend(position);
			this.wayPoints.push(location);
		}

		Map.prototype.makePolyline = function () {
			this.runPath = new google.maps.Polyline({
				path: this.wayPoints,
				geodesic: true,
				strokeColor: '#FC4C02',
			    strokeOpacity: 0.5,
			    strokeWeight: 2
			});
		}

		Map.prototype.makeOtherPolyline = function (ghost) {
			var otherWayPoints = makeWayPoints(ghost);
			this.existingPath = new google.maps.Polyline({
				path: otherWayPoints,
				geodesic: true,
				strokeColor: '#387ef5',
			    strokeOpacity: 0.5,
			    strokeWeight: 2
			});
			otherWayPoints.forEach(loc => {
				loc = new google.maps.LatLng(loc.lat, loc.lng)
				this.bounds.extend(loc);
			});
		}

		Map.prototype.drawAndSetPolyline = function () {
			this.makePolyline();
			this.runPath.setMap(this.gmap);
			this.gmap.fitBounds(this.bounds);
		}

		Map.prototype.setOpponentPolyline = function (ghost) {
			this.wayPoints = [];
		    this.makeOtherPolyline(ghost);
		    this.existingPath.setMap(this.gmap);
		    this.gmap.fitBounds(this.bounds);
		}

		Map.prototype.tick = function (runData) {
			console.log(runData.locations);
			console.log(this.wayPoints);
			if (runData.locations && (runData.locations.length > this.wayPoints.length)) {
                var lastLocation = runData.locations[runData.locations.length - 1];
	            this.addWayPoint({
                    lat: Number(lastLocation.lat),
                    lng: Number(lastLocation.lng)
                })
	        }
	       	this.drawAndSetPolyline();
		}	

		cachedMap = new Map(ghost);
		return factory.configureGoogleMap(elementId, options);
	}

	return factory;
});
