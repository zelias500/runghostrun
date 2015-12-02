app.factory('GhostFactory', function ($http, $rootScope, $cordovaGeolocation) {
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
		return $http.get("/api/ghosts/" + ghostId + "/users/" +  userId)
		.then(toData);
	};

	factory.getNearbyGhosts = function () {
		return $cordovaGeolocation.getCurrentPosition().then(function(position){
			return $http.get('/api/ghosts/nearby?'+'lat='+position.coords.latitude+'&lng='+position.coords.longitude)
			.then(toData);			
		}).then(null, alert)
	};
	
	return factory;
});