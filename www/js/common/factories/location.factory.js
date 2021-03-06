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

			var _warmUp = 0;
			var _throttle = false;

			var watchCb = function (pos) {

				// throttle the first several attempts to allow geolocator to warm up
				while (_warmUp < 5) {
					_warmUp++;
					return null;
				}

				// only take every other call from the watcher
				if (_throttle) {
					_throttle = !_throttle;
					return null;
				} else _throttle = !_throttle;

				pos = {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
					timestamp: pos.timestamp
				}
				data.locations.push(pos);
				var locationsLength = data.locations.length;
				if (data.locations.length >= 1) {
					var calcDistance = calcGeoDistance(data.locations[locationsLength - 2], data.locations[locationsLength - 1])
					if (calcDistance > 50 ) data.locations.pop();
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

		stopRun: function () {
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

		saveRun: function (userId, _stopData) {

			// if this is a new ghost
			if (!_stopData.ghost) {
				_stopData.owner = userId;
				_stopData.runner = userId;
				_stopData.privacy = stopData.privacy;

				return GhostFactory.create(_stopData)
				.then(ghost => {
					_stopData.ghost = ghost._id;
					return RunFactory.create(_stopData)
				.then(run => run)
				})
				.then(null, errorHandler)

			// otherwise, simply save the run
			} else {
				_stopData.ghost = _stopData.ghost._id;
				_stopData.runner = userId;
				
				return RunFactory.create(_stopData)
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
