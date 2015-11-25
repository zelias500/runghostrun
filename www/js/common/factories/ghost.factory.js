app.factory('GhostFactory', function ($http) {
	var factory = {};

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

	factory.createNewTime = function (data) {
		return $http.post('/api/ghosts', data)
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


	

	return factory;
});