app.factory('GhostFactory', function ($http, $rootScope, $cordovaGeolocation) {
	var factory = {};
	var ghostDistanceOrder; // for 'nearby' ghosts: preserve original order so we know which ghosts were closest
	var currentPosition = false; // caches current position from app.run to avoid unecessary geolocation calls

	function toData (res) {
		return res.data;
	}

	factory.fetchAll = function () {
		return $http.get('/api/ghosts')
		.then(toData);
	};

	factory.fetchById = function (id) {
		return $http.get('/api/ghosts/' + id)
		.then(toData);
	};

	factory.fetchRuns = function (id) {
		return $http.get('/api/ghosts/' + id + '/runs')
		.then(toData);
	}

	factory.create = function (data) {
		return $http.post('/api/ghosts/', data)
		.then(toData);
	}

	factory.addNewRun = function (id, data) {
		data.runner = $rootScope.userId;
		return $http.post('/api/ghosts/' + id, data)
		.then(toData);
	};

	factory.update = function (id, data) {
		return $http.put('/api/ghosts/' + id, data)
		.then(toData);
	};

	factory.delete = function (id) {
		return $http.delete('/api/ghosts/' + id)
		.then(toData);
	};

	factory.getUsersBest = function (ghostId, userId) {
		return $http.get("/api/ghosts/" + ghostId + "/users/" + userId)
		.then(toData);
	};

	factory.getNearbyGhostsWithRuns = function () {

		// if currentPosition isn't cached, fetch it now
		return new Promise((resolve) => {
			if (!currentPosition) {
				return $cordovaGeolocation.getCurrentPosition()
				.then(position => {
					factory.setCurrentPosition({lat: position.coords.latitude,lng: position.coords.longitude});
					resolve(currentPosition)
				});
			} else resolve(currentPosition);
		})

		// get nearby ghosts using our currentPosition
		.then(() => {
			return $http.get('/api/ghosts/nearby/', {
				params: {
					lat: currentPosition.lat,
					lng: currentPosition.lng
				}
			})
		})
		.then(toData)

		// get the runs for each ghost, and attach them to the ghost document
		.then(ghosts => {
			var promises = [];
            ghosts.forEach(ghost => {
            	var promise = factory.fetchRuns(ghost._id)
                .then(runs => {
                    ghost.runs = runs;
                    return ghost;
                })
                promises.push(promise);
            })
            return Promise.all(promises);
        })
        .then(ghostArr => {
        	ghostDistanceOrder = _.flatten(ghostArr);
        	return angular.copy(ghostDistanceOrder);
        })
		.then(null, console.error)
	};

	factory.getOrderCache = function () {
		return angular.copy(ghostDistanceOrder);
	};

	factory.setCurrentPosition = function (location) {
		currentPosition = location;
	};

	factory.getCurrentPosition = function () {
		return currentPosition;
	}

	return factory;
});
