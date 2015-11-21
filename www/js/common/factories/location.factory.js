app.factory('LocationFactory', function($cordovaGeolocation){
	function errorHandler (err){
		console.error(err);
	};

	var earthRadius = 6371000 // in km
	function toRad (degrees){
		return degrees * Math.PI/180;
	}
	function calcGeoDistance(loc1, loc2){
		var latRads1 = toRad(loc1.coords.latitude);
		var latRads2 = toRad(loc2.coords.latitude);
		var latDeltaRads = toRad(loc2.coords.latitude-loc1.coords.latitude);
		var longDeltaRads = toRad(loc2.coords.longitude-loc1.coords.longitude);

		var a = Math.sin(latDeltaRads/2) * Math.sin(latDeltaRads/2) + Math.cos(latRads1) * Math.cos(latRads2) * Math.sin(longDeltaRads/2) * Math.sin(longDeltaRads/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return (earthRadius * c).toFixed(1);
	}

	function calcPointTime(loc1, loc2){
		return loc2.timestamp - loc1.timestamp;
	}

	var options = {
		enableHighAccuracy: false,
		timeout: 5000
	};

	var data = {
		locations: [],
		distance: 0,
		time: 0,
		speedPoints: []
	}

	var watchId = null;

	var theFactory = {

		// clears location data array and attaches a position watcher
		startNewRun: function(){
			// locations = [];
			$cordovaGeolocation.watchPosition(options)
			.then(function (id) {
				watchId = id;
			})
			.then(null, errorHandler, function(pos){
				console.log("POSITION", pos);
				data.locations.push(pos);
				return data;
			});
		},
		
		stopRun: function () {
			$cordovaGeolocation.clearWatch(watchId);
		},

		getCurrentRunData: function(){
			return data;
		},

		// calculates total run distance of data.locations array
		calcDistance: function(){
			var totalDistance = 0;
			var dist = data.locations.reduce(function(prev, curr){
				totalDistance += calcGeoDistance(prev, curr);
				return curr;
			})
			data.distance = totalDistance;
			return data;			
		},

		// 	calculates total time of the run
		calcTime: function(){
			if (data.distance == 0) theFactory.calcDistance();
			var totalTime = calcPointTime(data.locations[0], data.locations[data.locations.length-1]);
			data.time = totalTime;
			return data;
		},

		// fills data.speedPoints with the velocity between two points in data.locations
		calcSpeed: function(){
			data.locations.reduce(function(prev, curr){
				var d = calcGeoDistance(prev, curr);
				var t = calcPointTime(prev, curr);
				data.speedPoints.push(d/t);
				return curr;
			})
			return data;
		},

		// speed conversions
		getAvgSpeed: function(inMiles){
			var toReturn = (data.distance/1000)/(data.time/1000/3600); // convert to km/hr
			if (inMiles) toReturn /= 1.6; // converts km/hr ==> mi/hr
 			return toReturn;
		},

		// FOR TESTING PURPOSES ONLY
		addLocationPoint: function(point){
			data.locations.push(point);
		}
	}

	return theFactory;
})