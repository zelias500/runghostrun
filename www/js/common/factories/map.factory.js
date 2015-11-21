app.factory('MapFactory', function () {
	var factory = {};

	// returns a new map instance from the entered ghost data
	factory.newMap = function (ghost) {

		// helper function to make waypoints
		function makeWayPoints (ghost) {
			return ghost.locations.map(loc => {
				return {
            		location: {
		                lat: Number(loc.lat),
		                lng: Number(loc.lng)
            		},
            		stopover: false
        		}
			});
		}

		// Map constructor function
		function Map (ghost) {
			this.wayPoints = makeWayPoints(ghost);
			this.center = this.wayPoints[0].location.lat + ', ' + this.wayPoints[0].location.lng;
			this.destination = this.wayPoints[this.wayPoints.length - 1].location.lat + ', ' + this.wayPoints[this.wayPoints.length - 1].location.lng;
			this.url = 'http://maps.google.com/thiss/api/js?v=3.20&client=AIzaSyAll4lFrjQHmozCEhpwsDIH6AKlkySPQzw';
			this.mode = 'WALKING';
			this.draggable = true;
			
		}

		return new Map(ghost);
	}

	return factory;
});