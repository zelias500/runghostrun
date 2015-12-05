app.factory('RunFactory', function($http){
	function toData (res) {
		return res.data;
	}

	var factory = {};

	factory.fetchAll = function () {
		return $http.get('/api/runs')
		.then(toData);
	};

	factory.create = function (data) {
		return $http.post('/api/runs', data)
		.then(toData);
	}

	factory.fetchById = function (id) {
		return $http.get('/api/runs/' + id)
		.then(toData);
	};

	factory.update = function (id, data) {
		return $http.put('/api/runs/' + id, data)
		.then(toData);
	};

	factory.delete = function (id) {
		return $http.delete('/api/runs/' + id)
		.then(toData);
	};

	return factory;
})