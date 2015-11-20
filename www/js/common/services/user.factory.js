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
	factory.fetchChallengeById = function (uid, cid) {
		return $http.get('/api/users/' + uid + '/challenges/' + cid)
		.then(toData);
	};
	factory.createUser = function (data) {
		return $http.post('/api/users', data)
		.then(toData);
	};
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