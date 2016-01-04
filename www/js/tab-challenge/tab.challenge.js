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
                return GhostFactory.getNearbyGhostsWithRuns()
                .then(function (ghosts) {
                    $ionicLoading.hide();
                    return ghosts;
                })
            }
        }
    });
});

app.controller('ChallengeCtrl', function ($scope, ghosts, GhostFactory, Session, $ionicPopup) {

    $scope.ghosts = ghosts;
    $scope.predicate = 'nearest';

    function byPopularity () {
        $scope.ghosts.sort( (a, b) => {
            return b.runs.length - a.runs.length
        })
    }

    function byMostRecent () {
        $scope.ghosts.sort( (a, b) => {
            return new Date(b.runs[b.runs.length-1].timestamp) - new Date(a.runs[a.runs.length-1].timestamp);
        })         
    }

    function byLength () {
        $scope.ghosts.sort( (a, b) => {
            return b.distance - a.distance;
        })  
    }

    $scope.sortGhosts = function (sortMethod) {
        $scope.predicate = sortMethod;
        if (sortMethod === 'popular'){
            byPopularity();
        }
        else if (sortMethod === 'recent') {
            byMostRecent();
        }
        else if (sortMethod === 'runLength') {
            byLength();
        }
        else {
            $scope.ghosts = GhostFactory.getOrderCache();
        }
    }

    $scope.newChallenge = function(ghostId) {
        if (!Session.user) return false;
        return Session.user.newChallenges.indexOf(ghostId) !== -1;
    }

    $scope.refreshChallenges = function(){
        GhostFactory.getNearbyGhostsWithRuns()
        .then(function (newGhosts){
            $scope.ghosts = newGhosts;
            $scope.$broadcast('scroll.refreshComplete');
        })
        .then(null, function(){
            $ionicPopup.alert({
                title: 'Error Refreshing!',
                template: 'Sorry, there was a problem refreshing, please try again'
            });
            $scope.$broadcast('scroll.refreshComplete');
        })
    }
});
