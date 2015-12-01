app.factory('LocationFactory', function($cordovaGeolocation, UserFactory, GhostFactory){
	function errorHandler (err){
		console.error(err);
	};

	var earthRadius = 6371000 // in km
	function toRad (degrees){
		return degrees * Math.PI/180;
	}
	function calcGeoDistance(loc1, loc2){
		var latRads1 = toRad(loc1.lat);
		var latRads2 = toRad(loc2.lat);
		var latDeltaRads = toRad(loc2.lat-loc1.lat);
		var longDeltaRads = toRad(loc2.lng-loc1.lng);
		var a = Math.sin(latDeltaRads/2) * Math.sin(latDeltaRads/2) + Math.cos(latRads1) * Math.cos(latRads2) * Math.sin(longDeltaRads/2) * Math.sin(longDeltaRads/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		return Number((earthRadius * c).toFixed(1));
	}

	function calcPointTime(loc1, loc2){
		return loc2.timestamp - loc1.timestamp;
	}

	var options = {
		enableHighAccuracy: false,
		timeout: 5000
	};

	var data = {
		locations: [{
	      lat: "40.70",
	      lng: "-74.00"
		}],
		distance: 0,
		time: 0,
		speedPoints: []
	}

	var currentGhost;

	var watchId = null;
	var stopData;

	var theFactory = {

		// clears location data array and attaches a position watcher
		startNewRun: function () {
			data.ghost = currentGhost;
			watchId = navigator.geolocation.watchPosition(function(pos){
				pos = {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
					timestamp: pos.timestamp
				}
				data.locations.push(pos);
				var locationsLength = data.locations.length;
				if (data.locations.length != -1){
					data.distance+= calcGeoDistance(data.locations[locationsLength-2],data.locations[locationsLength-1]);
				}
				return data;
			}, errorHandler, options)
		},

		getLocIndex: function(){
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

		setGhost: function(ghost) {
			currentGhost = ghost;
		},		

		getGhost: function() {
			return currentGhost;
		},

		saveRun: function(userId, stopData){
			if (!stopData.ghost){
				stopData.runner = userId;
				stopData.privacy = stopData.privacy.toLowerCase();
				return UserFactory.createGhost(userId, stopData)
				.then(function(user){
	        	        	return user;
	        	        }, errorHandler);
			}
			else {
				return GhostFactory.addNewRun(stopData.ghost._id, stopData)
			}
		},

		getCurrentRunData: function(){
			return data;
		},		

		getStopData: function(){
			return stopData;
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
			var toReturn = (data.distance/1000)/(data.time/3600); // convert to km/hr
			if (inMiles) toReturn /= 1.6; // converts km/hr ==> mi/hr
 			return Number(toReturn.toFixed(2));
		},

		getGhostAvg: function(ghost){
			var toReturn = (ghost.totalDistance/1000)/(ghost.best.time/3600); // convert to km/hr
			// if (inMiles) toReturn /= 1.6; // converts km/hr ==> mi/hr
 			return Number(toReturn.toFixed(2));
		},

		// FOR TESTING PURPOSES ONLY
		addLocationPoint: function(point){
			data.locations.push(point);
		},

		emptyStopData: function(){
			stopData = undefined;
		}
	}

	return theFactory;
})
