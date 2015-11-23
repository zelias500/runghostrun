app.config(function ($stateProvider) {
	$stateProvider.state('newchallenge', {
		url: '/new',
		data: {
			authenticate: true
		},
		views: {
			'new-challenge': {
				templateUrl: 'js/challenge/challenge.html',
				controller: 'NewChallengeCtrl'
			}
		},
		resolve: {
			ghost: function ($stateParams) {
				return GhostFactory.fetchById($stateParams.id);
			}
		}
	});
});

app.controller('NewChallengeCtrl', function ($scope, ghost, MapFactory) {
	$scope.ghost = ghost;
});