app.factory('StatFactory', function () {
	var factory = {};

	// takes a run - returns the average pace in min/m
	factory.minMeter = function (run) {		
		var distance = run.distance; // distance in meters
		var time = Math.floor(run.time / 60) // time in minutes
		if (time === 0) return 0; // prevent dividing by zero
		return Math.round(time / distance);
	};

	// takes a run - returns the average pace in min/km
	factory.minKm = function (run) {
		var distance = run.distance; // distance in meters
		var time = Math.floor(run.time / 60) // time in minutes
		if (time === 0) return 0; // prevent dividing by zero
		return Math.round(time / (distance * 100));
	};

	// converts pace in min/km to min/mile
	factory.minKm2minMi = function (pace) {
        return Math.floor(pace * 1.609344);	
	};

	// converts distance in km to miles
	factory.km2mi = function (km) {
        return Math.floor(km * 0.621371);
	}

	return factory;
});