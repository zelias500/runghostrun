app.factory('ValidationFactory', function (LocationFactory, $cordovaGeolocation) {
	var factory = {};

	// tell a user whether the run they are about to start will be valid
	factory.validateChallengeStart = function (ghostStart) {
		return $cordovaGeolocation.getCurrentPosition().then(pos => {
			var validationObj = {
				lat: pos.coords.latitude,
				lng: pos.coords.longi
			}
			return LocationFactory.validateDistance(validationObj, ghostStart)
		})
	}

	// takes stopData with a populated ghost field (aka it's a challenge)
	factory.validateRun = function (runData) {
	    // THREE FACTOR VALIDATION:
	    // 1) do the distances roughly match up?
		function validateDistance () {
			return Math.abs(runData.ghost.distance - runData.distance) < 100;
		}
	    // 2) is the run start point far from the ghost's start point?
		function validateStart () {
			return LocationFactory.validateDistance(runData.locations[0], runData.ghost.locations[0])
		}
	    // 3) is the run end point far from the ghost's end point?
		function validateEnd () {
			return LocationFactory.validateDistance(runData.locations[runData.locations.length-1], runData.ghost.locations[runData.ghost.locations.length-1])
		}
		
	    return validateDistance() && validateStart() && validateEnd();
	};

	return factory;
});