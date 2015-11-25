app.config(function ($stateProvider) {
	$stateProvider.state('tab.ghost', {
		url: '/ghost/:gid',
		data: {
			authenticate: true
		},
		views: {
			'tab-challenge': {
				templateUrl: 'js/tab-challenge-ghost/tab.challenge.ghost.html',
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