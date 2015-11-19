app.config(function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'js/home/home-template.html',
		controller: 'HomeCtrl'
	});
});

app.controller('HomeCtrl', function ($scope) {
	$scope.something = "Hello something!"
});