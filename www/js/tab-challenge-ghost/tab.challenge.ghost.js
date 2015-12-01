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

app.controller('GhostCtrl', function ($scope, ghost, usersBest, MapFactory, $state, LocationFactory, TimeFactory) {
	$scope.ghost = ghost;
	$scope.usersBest = usersBest;

    $scope.$on('$ionicView.enter', function(scopes, states) {
        if (states.direction === 'swap') $state.go('tab.challenge', {reload: true});
    });

    $scope.setGhost = function(best) {
    	LocationFactory.setGhost($scope.ghost);
    };

	$scope.displayTime = function(best){
		if (best) return TimeFactory.timeDisplay($scope.ghost.best);
		return TimeFactory.timeDisplay($scope.usersBest.time);
	};

	$scope.findDistance = function(best){
		if (best) return $scope.ghost.bestRun.distance;
		return $scope.usersBest.distance;
	};

	$scope.getAvgSpeed =  function(best, inMiles){
		var toReturn 
		if (best) toReturn = ($scope.ghost.bestRun.distance/1000)/($scope.ghost.bestRun.time/3600);
		else toReturn = ($scope.usersBest.distance/1000)/($scope.usersBest.time/3600); // convert to km/hr
		if (inMiles) toReturn /= 1.6; // converts km/hr ==> mi/hr
		return Number(toReturn.toFixed(2));
	}
});