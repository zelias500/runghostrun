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
			}
		}
	});
});

app.controller('GhostCtrl', function ($scope, ghost, MapFactory, $state, LocationFactory) {
	// console.log(ghost)
	$scope.ghost = ghost;

    $scope.$on('$ionicView.enter', function(scopes, states) {
    	console.log(states)
        if (states.direction === 'swap') $state.go('tab.challenge', {reload: true});
    });

    $scope.challengeGhost = function() {
    	LocationFactory.setGhost($scope.ghost);
    	$state.go('tab.record')
    }
});