app.factory('StatFactory', function () {
	var factory = {};

	// takes a run - returns the average pace in min/m
	factory.minMeter = function (run) {		
		var distance = run.distance; // distance in meters
		var time = ((run.time) / 60) // time in minutes
		if (distance === 0) return 0; // prevent dividing by zero
		var pace = (time / distance).toFixed(2);
		return Number(pace);
	};

	// takes a run - returns the average pace in min/km
	factory.minKm = function (run) {
		var distance = run.distance; // distance in meters
		var time = ((run.time) / 60); // time in minutes
		if ((distance / 1000) === 0) return 0; // prevent dividing by zero

		var pace = (time / (distance / 1000)).toFixed(2);
		return Number(pace);
	};

	// converts pace in min/km to min/mile
	factory.minKm2minMi = function (pace) {
        var pace = (pace * 1.609344).toFixed(2);
        return Number(pace);
	};

	// converts distance in km to miles
	factory.km2mi = function (km) {
        var pace = (km * 0.621371).toFixed(2);
        return Number(pace);
	}

	return factory;
});