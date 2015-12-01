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

app.controller('StatisticsCtrl', function ($scope, $state, user, averagePace, averageDistance) {
    $scope.user = user;
    $scope.numRuns = user.runs.length;
    $scope.numGhosts = user.ghosts.length;

    $scope.averagePaceKm = Math.floor(averagePace * 60);
    $scope.averagePaceMi = convertPace($scope.averagePaceKm);
    $scope.averageDistanceKm = Math.floor(averageDistance);
    $scope.averageDistanceMi = convertDistance($scope.averageDistanceKm);

    function convertDistance (km) {
        return Math.floor(km * 0.621371);
    }

    function convertPace (pace) {
        return Math.floor(pace * 1.609344);
    }

});