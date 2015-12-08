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
			},
			ghostRuns: function(GhostFactory, $stateParams) {
				return GhostFactory.fetchRuns($stateParams.gid);
			}
		}
	});
});

app.controller('GhostCtrl', function ($scope, $state, ghost, usersBest, LocationFactory, d3Factory, ghostRuns) {

	$scope.ghost = ghost;
	$scope.ghostBest = ghost.bestRun;
	$scope.usersBest = usersBest;

	console.log(usersBest);

    $scope.setGhost = function (best) {
    	LocationFactory.setGhost($scope.ghost);
    };

    var best5Runs = ghostRuns.sort((a,b) => {
    	return b.time < a.time;
    }).slice(0,5);

    $scope.chart = d3Factory.getStatsAbout('ghost', best5Runs)
});
