app.factory('SpeechFactory', function (Session, StatFactory, $timeout) {

	var ghostPace;
	var overtaking = false;
	var lockout = false;
	var winningUtterance = new SpeechSynthesisUtterance('You are currently overtaking the ghost. Keep it up!');
	var losingUtterance = new SpeechSynthesisUtterance('The ghost is ahead of you. Keep it together!');
	var factory = {};

	factory.checkProgress = function (currentRun, ghost) {

		
		var yourPace;
		window.speechSynthesis.speak(winningUtterance);
		
		// wait ten seconds after speaking to avoid spamming the user
		if (lockout) return;

		// set ghostPace once per run
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
			lockout = true;
			window.speechSynthesis.speak(winningUtterance);
			$timeout(() => {
				lockout = false
			}, 10);

		} else if (overtaking && !isAhead) {
			overtaking = false;
			lockout = true;
			window.speechSynthesis.speak(losingUtterance);
			$timeout(() => {
				lockout = false
			}, 10);
		}		
	}

	return factory;
});