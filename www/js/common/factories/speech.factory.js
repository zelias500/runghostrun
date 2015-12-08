app.factory('SpeechFactory', function (Session, StatFactory) {

	var ghostPace;
	var overtaking = false;
	var winningUtterance = new SpeechSynthesisUtterance('You are currently overtaking the ghost. Keep it up!');
	var losingUtterance = new SpeechSynthesisUtterance('The ghost is ahead of you. Keep it together!');
	var factory = {};

	factory.checkProgress = function (currentRun, ghost) {
		var yourPace;

		if (!ghostPace) {
			let ghostPaceKm = StatFactory.calculatePaceKilometers(ghost);
			if (Session.user.isMetric) ghostPace = ghostPaceKm;
			else ghostPace = StatFactory.convertPaceMetricToMiles(ghostPaceKm);
		}

		let yourPaceKm = StatFactory.calculatePaceKilometers(currentRun);
		if (Session.user.isMetric) yourPace = yourPaceKm;
		else yourPace = StatFactory.convertPaceMetricToMiles(yourPaceKm);

		let currentTime = currentRun.time;
		let isAhead = ((currentTime / yourPace) > (currentTime / ghostPace));

		if (!overtaking && isAhead) {
			overtaking = true;
			window.speechSynthesis.speak(winningUtterance);

		} else if (overtaking && !isAhead) {
			overtaking = false;
			window.speechSynthesis.speak(losingUtterance);
		}		
	}

	return factory;
});