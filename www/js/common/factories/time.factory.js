app.factory('TimeFactory', function ($http) {
	var factory = {};

	factory.timeDisplay = function (timeInSeconds) {
	    var seconds = timeInSeconds %60
		timeInSeconds -= seconds;
		var minutes = timeInSeconds / 60;
		var hours = Math.floor(minutes/60);
		minutes -= hours*60;
		if (seconds < 10) seconds = "0" + seconds;
		if (minutes < 10) minutes = "0" + minutes;
		if (hours) return hours + ":" + minutes + ":" + seconds;
		return minutes + ":" + seconds;

	}
	
	return factory;
});