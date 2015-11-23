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

		// Map constructor function
		function Map (ghost) {
			this.id = ghost._id;
			this.ghost = ghost;
			var wayPoints = makeWayPoints(ghost);
			this.wayPoints = wayPoints;
			this.runPath = new google.maps.Polyline({
				path: wayPoints,
				geodesic: true,
				strokeColor: 'red',
			    strokeOpacity: 0.8,
			    strokeWeight: 2
			});
			this.center = {lat:this.wayPoints[0].lat, lng: this.wayPoints[0].lng};
			this.destination = {lat:this.wayPoints[0].lat, lng: this.wayPoints[0].lng};
			this.url = 'https://maps.google.com/maps/api/js?v=3.20&client=AIzaSyAll4lFrjQHmozCEhpwsDIH6AKlkySPQzw';
			this.mode = 'WALKING';
			this.draggable = true;
		}

		return new Map(ghost);
	}

	return factory;
});
