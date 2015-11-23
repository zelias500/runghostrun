app.config(function ($stateProvider) {
	$stateProvider.state('tab.challenge', {
        url: '/challenge',
        data: {
            authenticate: true
        },
        views: {
        	'tab-challenge': {
           		templateUrl: 'js/tab-challenge/tab.challenge.html',
            	controller: 'ChallengeCtrl'
        	}
        },
        resolve: {
            ghosts: function (GhostFactory) {
                return GhostFactory.fetchAll();
            }
        }
	});
});

app.controller('ChallengeCtrl', function ($scope, ghosts, MapFactory) {
    $scope.something = "Hello we are in Challenge!";

    // testing filter to remove junk data
    ghosts = ghosts.filter(ghost => ghost.locations.length !== 0);
    $scope.maps = ghosts.map(ghost => MapFactory.newMap(ghost));
});
