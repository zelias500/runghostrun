app.factory('MapFactory', function ($ionicLoading) {
	var factory = {};
	const startIcon = "https://maps.gstatic.com/mapfiles/ms2/micons/green.png";
	const finishIcon = "https://maps.gstatic.com/mapfiles/ms2/micons/flag.png";
	const currentIcon = "https://maps.gstatic.com/mapfiles/ms2/micons/red.png";

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
				drawMarker(initialLocation, startIcon);
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
			if (runData.locations && (runData.locations.length > this.wayPoints.length)) {
                var lastLocation = runData.locations[runData.locations.length - 1];
				var LatLng = {
                    lat: Number(lastLocation.lat),
                    lng: Number(lastLocation.lng)
                }
	            this.addWayPoint(LatLng);
	            if (cachedMap.frontMarker) cachedMap.frontMarker.setMap(null);
	            cachedMap.frontMarker = drawMarker(lastLocation, currentIcon)
	        }
	       	this.drawAndSetPolyline();
		}	

		Map.prototype.drawEndPointMarkers = function(){
			drawMarker(this.wayPoints[0], startIcon);
			drawMarker(this.wayPoints[this.wayPoints.length-1], finishIcon);
		}

		cachedMap = new Map(ghost);
		return factory.configureGoogleMap(elementId, options);

	}

	function drawMarker(coords, ourIcon){
		var marker;
		if (typeof coords.lat == "function"){
			marker = new google.maps.Marker({
				position: coords,
				map: cachedMap.gmap,
				icon: ourIcon
			})		
		}
		else {
			marker = new google.maps.Marker({
				position: {
					lat: Number(coords.lat),
					lng: Number(coords.lng)
				},
				map: cachedMap.gmap,
				icon: ourIcon
			})
		}
		marker.setMap(cachedMap.gmap);
		return marker;
	}

	return factory;
});
