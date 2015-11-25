
app.factory('MapFactory', function () {
	var factory = {};

	// var ourMap = undefined;

	// factory.getMap = function() {
	// 	return ourMap;
	// }

	// returns a new map instance from the entered ghost data
	factory.newMap = function (ghost) {

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
			if (ghost){
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

		Map.prototype.makePolyline = function() {
			this.runPath = new google.maps.Polyline({
				path: this.wayPoints,
				geodesic: true,
				strokeColor: 'red',
			    strokeOpacity: 0.8,
			    strokeWeight: 2
			});
		}
		return new Map(ghost);
		// return ourMap;way
	}

	return factory;
});
