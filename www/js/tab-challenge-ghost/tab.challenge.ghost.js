app.config(function ($stateProvider) {
	$stateProvider.state('tab.ghost', {
		url: '/ghost/:gid',
		data: {
			authenticate: true
		},
		views: {
			'tab-challenge': {
				templateUrl: 'js/tab-challenge-ghost/tab.challenge.ghost.html',
				controller: 'GhostCtrl'
			}
		},
		resolve: {
			ghost: function (GhostFactory, $stateParams) {
				return GhostFactory.fetchById($stateParams.gid);
			},
			usersBest: function (GhostFactory, $stateParams, $rootScope) {
				return GhostFactory.getUsersBest($stateParams.gid, $rootScope.userId);
			}
		}
	});
});

app.controller('GhostCtrl', function ($scope, $state, ghost, usersBest, LocationFactory) {

	$scope.ghost = ghost;
	$scope.ghostBest = ghost.bestRun;
	$scope.usersBest = usersBest;

    $scope.setGhost = function (best) {
    	LocationFactory.setGhost($scope.ghost);
    };

});
