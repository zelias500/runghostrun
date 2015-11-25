app.factory('UserFactory', function ($http) {
	var factory = {};

	function toData (res) {
		return res.data;
	}

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
	factory.fetchAllChallenges = function (id) {
		return $http.get('/api/users/' + id + '/challenges')
		.then(toData);
	};
	factory.fetchRecentFriendData = function(id){
		return $http.get('/api/users/' + id + '/friends/recent')
		.then(toData);
	};
	factory.fetchAvgPace = function(id){
	     return this.fetchAllChallenges(id).then(function(Allghosts){
				var totalDistance = Allghosts.reduce(function(curr, next){
					return curr + next.totalDistance
				},0);
				var totalTime = Allghosts.reduce(function(curr, next){
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
	factory.fetchAvgDis = function(id){
       return this.fetchAllChallenges(id).then(function(Allghosts){
				var totalDistance = Allghosts.reduce(function(curr, next){
				return curr + next.totalDistance
				},0);

				return Math.round(totalDistance/Allghosts.length *100)/100;
       })
	};

	factory.fetchChallengeById = function (uid, cid) {
		return $http.get('/api/users/' + uid + '/challenges/' + cid)
		.then(toData);
	};
	factory.createUser = function (data) {
		return $http.post('/api/users', data)
		.then(toData);
	};
	factory.createFriend = function(userid, friendid){
		return $http.post('/api/users/' + userid +"/addFriend", {friendid})
		.then(toData)
	}
	factory.createGhost = function (id, data) {
		return $http.post('/api/users/' + id + '/ghost', data)
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