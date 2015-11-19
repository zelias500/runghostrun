app.config(function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'www/js/home/home-template.html',
		controller: 'HomeCtrl'
	});
});

app.controller('HomeCtrl', function ($scope) {
	$scope.something = "Hello something!"
})