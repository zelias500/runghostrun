app.factory('StatFactory', function () {
	var factory = {};

	const paceConverter = 1.609344;
	const distanceConverter = 0.621371;

	// takes a run - returns the average pace in min/km
	factory.calculatePaceKilometers = function (run) {
		var distance = run.distance; 						// distance in meters
		var time = ((run.time) / 60); 						// time in minutes
		if ((distance / 1000) === 0) return 0; 				// prevent dividing by zero
		var pace = (time / (distance / 1000)).toFixed(2);
		return Number(pace);
	};

	// converts pace in min/km to min/mile
	factory.convertPaceMetricToMiles = function (metricPace) {
        var pace = (metricPace * paceConverter).toFixed(2);
        return Number(pace);
	};

	// converts distance in km to miles
	factory.convertDistanceMetricToMiles = function (km) {
        var pace = (km * distanceConverter).toFixed(2);
        return Number(pace);
	};

	return factory;
});
