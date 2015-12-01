app.factory('UserFactory', function ($http) {
	var factory = {};

	function toData (res) {
		return res.data;
	};

	factory.fetchAll = function () {
		return $http.get('/api/users')
		.then(toData);
	};

	factory.fetchById = function (id) {
		return $http.get('/api/users/' + id)
		.then(toData);
	};

	factory.fetchAllFriends = function (id) {
		return $http.get('/api/users/' + id + '/friends')
		.then(toData);
	};

	factory.fetchAllFollowers = function (id) {
		return $http.get('/api/users/' + id + '/followers')
		.then(toData);
	};

	factory.fetchAllRuns = function (id) {
		return $http.get('/api/users/' + id + '/runs')
		.then(toData);
	};

	factory.fetchAllGhosts = function (id) {
		return $http.get('/api/users/' + id + '/ghosts')
		.then(toData);
	};

	factory.fetchRecentFriendData = function (id) {
		return $http.get('/api/users/' + id + '/friends/recent')
		.then(toData);
	};

	// returns pace in min/km
	factory.fetchAvgPace = function (id) {
	    return this.fetchAllRuns(id)
	     	.then(function (runs) {

	     		// total distance in km
				var totalDistance = runs.reduce(function (curr, next) {
					return curr + (next.distance / 1000); // distance is originally in m, converting to km
				}, 0);

				// total time in minutes
				var totalTime = runs.reduce(function (curr, next) {
					return curr + next.time;
				}, 0);

   				var totalTimeinMin = Math.floor(totalTime / 60);

   				if (totalDistance === 0) return 0; // prevent dividing by zero

				var avgPace = Math.floor(totalTimeinMin / totalDistance);
				return avgPace;
	     });
	};

	// returns average distance in km
	factory.fetchAvgDistance = function (id) {
        return this.fetchAllRuns(id)
        .then(function (runs) {

        	if (runs.length === 0) return 0; // prevent dividing by zero

			var totalDistance = runs.reduce(function (curr, next) {
				return curr + (next.distance / 1000); // distance is originally in m, converting to km
			}, 0);

			return Math.floor(totalDistance / runs.length);
       });
	};

	factory.createUser = function (data) {
		return $http.post('/api/users', data)
		.then(toData);
	};

	factory.addFriend = function (userId, friendId) {
		return $http.post('/api/users/' + userId + "/friends", { friendId: friendId })
		.then(toData)
	};

	factory.removeFriend = function (userId, friendId) {
		return $http.put('/api/users/' + userId + "/friends/remove", { friendId: friendId })
		.then(toData)
	};

	factory.createGhost = function (id, data) {
		return $http.post('/api/users/' + id + '/ghosts', data)
		.then(toData);
	};

	factory.update = function (id, data) {
		return $http.put('/api/users/' + id, data)
		.then(toData);
	};
	
	factory.delete = function (id) {
		return $http.delete('/api/users/' + id)
		.then(toData);
	};

	return factory;
});