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
                return GhostFactory.getNearbyGhosts();
            }
        }
	});
});

app.controller('ChallengeCtrl', function ($scope, ghosts, MapFactory, $state) {

    // console.log('from controller', ghosts)
    // testing filter to remove junk data
    // ghosts = ghosts.filter(ghost => ghost.locations.length !== 0);
    // ghosts = ghosts.filter(ghost => ghost.owner !== null);
    // ghosts = ghosts.filter(ghost => ghost.best !== null);
    
    $scope.ghosts = ghosts;

});
