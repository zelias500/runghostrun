app.config(function($stateProvider){
	$stateProvider.state('tab.statistics', {
        url: '/statistics',
        data:{
            authenticate: true
        },
        views:{
            'tab-profile': {
                templateUrl: 'js/tab-profile/statistics/statistics.html',
                controller: 'StatisticsCtrl'
            }
        },
        resolve: {
            user: function (UserFactory, Session) {
                return UserFactory.fetchById(Session.user._id);
            },
            averagePace: function (UserFactory, Session) {
                return UserFactory.fetchAvgPace(Session.user._id);
            },
            averageDistance: function (UserFactory, Session) {
                return UserFactory.fetchAvgDistance(Session.user._id);
            }
        }
    });
});

app.controller('StatisticsCtrl', function ($scope, $state, user, averagePace, averageDistance, StatFactory) {
    $scope.user = user;
    $scope.numRuns = user.runs.length;
    $scope.numGhosts = user.ghosts.length;

    $scope.averagePaceKm = averagePace;
    $scope.averagePaceMi = StatFactory.minKm2minMi($scope.averagePaceKm);
    $scope.averageDistanceKm = averageDistance;
    $scope.averageDistanceMi = StatFactory.km2mi($scope.averageDistanceKm);
});