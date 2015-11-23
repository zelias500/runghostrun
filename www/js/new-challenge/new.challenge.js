app.config(function ($stateProvider) {
	$stateProvider.state('tab.newchallenge', {
		url: '/new/:gid',
		data: {
			authenticate: true
		},
		views: {
			'tab-challenge': {
				templateUrl: 'js/new-challenge/new.challenge.html',
				controller: 'NewChallengeCtrl'
			}
		},
		resolve: {
			ghost: function (GhostFactory, $stateParams) {
				console.log($stateParams)
				return GhostFactory.fetchById($stateParams.gid);
			}
		}
	});
});

app.controller('NewChallengeCtrl', function ($scope, ghost, MapFactory) {
	$scope.ghost = ghost;
});