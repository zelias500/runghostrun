app.factory('LocationFactory', function ($cordovaGeolocation, $rootScope, UserFactory, GhostFactory, RunFactory) {

	function errorHandler (err) {
		console.error(err);
	};

	var earthRadius = 6371000; // in km

	function toRad (degrees) {
		return degrees * Math.PI/180;
	};

	function calcGeoDistance (loc1, loc2) {
		if (!loc1 || !loc2) return 0;
		var latRads1 = toRad(loc1.lat);
		var latRads2 = toRad(loc2.lat);
		var latDeltaRads = toRad(loc2.lat-loc1.lat);
		var longDeltaRads = toRad(loc2.lng-loc1.lng);
		var a = Math.sin(latDeltaRads/2) * Math.sin(latDeltaRads/2) + Math.cos(latRads1) * Math.cos(latRads2) * Math.sin(longDeltaRads/2) * Math.sin(longDeltaRads/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return Number((earthRadius * c).toFixed(1));
	};

	function calcPointTime (loc1, loc2) {
		return loc2.timestamp - loc1.timestamp;
	};

	var options = {
		enableHighAccuracy: true,
		timeout: 5000
	};

	var data = {
		locations: [],
		distance: 0,
		time: 0,
		speedPoints: []
	};

	// if challenging a ghost, contains the ghost
	var currentGhost;
	// contains the id for the watch on current geoposition
	var watchId = null;
	// contains data that will be turned into a run and/or a ghost at the end of a run
	var stopData;
	// contains state for whether a run is a newly recorded ghost, or a challenge to an existing ghost
	var isChallenge;

	$rootScope.$on('start', function () {
		isChallenge = false;
	});
	$rootScope.$on('startChallenge', function () {
		isChallenge = true;
	});

	var factory = {

		// clears location data array and attaches a position watcher
		startNewRun: function () {

			var watchCb = function (pos) {
				pos = {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
					timestamp: pos.timestamp
				}
				data.locations.push(pos);
				var locationsLength = data.locations.length;
				if (data.locations.length >= 1) {
					var calcDistance = calcGeoDistance(data.locations[locationsLength - 2], data.locations[locationsLength - 1])
					if (calcDistance > 5000 ) data.locations.pop();
					else data.distance += calcDistance;
				}
				return data;
			}

			data.ghost = currentGhost;
			watchId = navigator.geolocation.watchPosition(watchCb, errorHandler, options);
		},

		getLocIndex: function () {
			return data.locations.length-1;
		},

		stopRun: function (userId) {
			navigator.geolocation.clearWatch(watchId);
			stopData = data;
			currentGhost = null;
			data = {
				locations: [],
				distance: 0,
				time: 0,
				speedPoints: []
			}
			return stopData;
		},

		setGhost: function (ghost) {
			currentGhost = ghost;
		},

		getGhost: function () {
			return currentGhost;
		},

		saveRun: function (userId, stopData) {

			// if this is a new ghost
			if (!stopData.ghost) {
				stopData.owner = userId;
				stopData.runner = userId;
				stopData.privacy = stopData.privacy.toLowerCase();

				return GhostFactory.create(stopData)
				.then(ghost => {
					stopData.ghost = ghost._id;
					return RunFactory.create(stopData)
				.then(run => run)
				})
				.then(null, errorHandler)

			// otherwise, simply save the run
			} else {
				stopData.ghost = stopData.ghost._id;
				stopData.runner = userId;
				
				return RunFactory.create(stopData)
				.then(run => run);
			}
		},

		getCurrentRunData: function () {
			return data;
		},

		getStopData: function () {
			return stopData;
		},

		// fills data.speedPoints with the velocity between two points in data.locations
		calcSpeed: function () {
			data.locations.reduce(function(prev, curr){
				var d = calcGeoDistance(prev, curr);
				var t = calcPointTime(prev, curr);
				data.speedPoints.push(d/t);
				return curr;
			})
			return data;
		},

		// FOR TESTING PURPOSES ONLY
		addLocationPoint: function (point) {
			data.locations.push(point);
		},

		emptyStopData: function () {
			stopData = undefined;
		},

		validateDistance: function(loc1, loc2) {

			// account for typing weirdness
			loc1.lat = Number(loc1.lat);
			loc1.lng = Number(loc1.lng);
			loc2.lng = Number(loc2.lng);
			loc2.lat = Number(loc2.lat);


			var dist = Math.abs(calcGeoDistance(loc1, loc2));
			// 300 meters?
			return dist < 300;
		},

		getChallengeState: function () {
			return isChallenge;
		}
	}

	return factory;
})
