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
            ghosts: function (GhostFactory, $ionicLoading) {
                $ionicLoading.show();
                return GhostFactory.getNearbyGhosts()
                    .then(function (ghosts) {
                        $ionicLoading.hide();
                        return ghosts;
                    });
            }
        }
	});
});

app.controller('ChallengeCtrl', function ($scope, ghosts, MapFactory, $state, GhostFactory) {
    $scope.predicate = 'nearest';
    function byPopularity() {
        $scope.ghosts.sort( (a,b) => {
            return b.runs.length - a.runs.length
        })
    }
    //byDate?
    function byRecency() {
        $scope.ghosts.sort( (a,b) => {
            return new Date(a.runs[a.runs.length-1].timestamp) - new Date(b.runs[b.runs.length-1].timestamp)
        })         
    }

    function byLength() {
        $scope.ghosts.sort( (a,b) => {
            return b.distance - a.distance
        })  
    }

    $scope.sortGhosts = function (sortMethod) {
        $scope.predicate = sortMethod;
        if (sortMethod == 'popular'){
            byPopularity();
        }
        else if (sortMethod == 'recency') {
            byRecency();
        }
        else if (sortMethod == 'runLength') {
            byLength();
        }
        else {
            $scope.ghosts = GhostFactory.getOrderCache();
        }
    }


    $scope.ghosts = ghosts;

});
