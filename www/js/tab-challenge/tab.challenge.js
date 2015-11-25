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

app.controller('ChallengeCtrl', function ($scope, ghosts, MapFactory, NgMap) {


    // testing filter to remove junk data
    ghosts = ghosts.filter(ghost => ghost.locations.length !== 0);
    $scope.ghosts = ghosts;

});
