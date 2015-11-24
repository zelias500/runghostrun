app.factory('MapFactory', function () {
	var factory = {};

	// returns a new map instance from the entered ghost data
	factory.newMap = function (ghost) {

		// helper function to make waypoints
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
				this.id = ghost._id;
				this.ghost = ghost;
				this.wayPoints = makeWayPoints(ghost);
				// this.center = {lat:this.wayPoints[0].lat, lng: this.wayPoints[0].lng};
			}
			else {
				this.wayPoints = [];
				// this.center = {lat:40.704651, lng: -74.009260};
			}
			this.bounds = new google.maps.LatLngBounds();
			this.makePolyline();
			this.url = 'https://maps.google.com/maps/api/js?v=3.20&client=AIzaSyAll4lFrjQHmozCEhpwsDIH6AKlkySPQzw';
			this.mode = 'WALKING';
			this.draggable = true;
		}

		// waypoints is an array of location object objects with lat and lng properties
		Map.prototype.addWayPoint = function(location) {
			var position = new google.maps.LatLng(location[0], location[1])
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
	}

	return factory;
});
