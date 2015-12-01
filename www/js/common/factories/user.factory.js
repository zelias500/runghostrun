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

	factory.fetchAllRuns = function (id) {
		return $http.get('/api/users/' + id + '/runs')
		.then(toData);
	};

	factory.fetchAllGhosts = function (id) {
		return $http.get('/api/users/' + id + '/ghosts')
		.then(toData);
	};

	factory.fetchRecentFriendData = function(id){
		return $http.get('/api/users/' + id + '/friends/recent')
		.then(toData);
	};

	factory.fetchAvgPace = function(id){
	     return this.fetchAllRuns(id).then(function(runs){
				var totalDistance = runs.reduce(function(curr, next){
					return curr + next.totalDistance
				},0);
				var totalTime = runs.reduce(function(curr, next){
					var matches = next.previousTimes.filter(function(time){
						return time.challenger = id;
					})
					return curr + matches.reduce(function(prev, curr){
						return prev += curr.time;
					}, 0)
				},0 );

   				var totalTimeinMin = Math.floor(totalTime/60);
				var avgPace = Math.round(totalDistance/totalTimeinMin * 100)/100;
				return avgPace;
	     })
	};

	// factory.fetchAvgDis = function(id){
 //       return this.fetchAllRuns(id).then(function(runs){
	// 			var totalDistance = runs.reduce(function(curr, next){
	// 			return curr + next.totalDistance
	// 			},0);

	// 			return Math.round(totalDistance/Allghosts.length *100)/100;
 //       })
	// };

	factory.createUser = function (data) {
		return $http.post('/api/users', data)
		.then(toData);
	};

	factory.addFriend = function (userId, friendId) {
		return $http.post('/api/users/' + userId + "/friends", { friendId: friendId })
		.then(toData)
	};

	factory.removeFriend = function (userId, friendId) {
		return $http.post('/api/users/' + userId + "/friends/remove", { friendId: friendId })
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