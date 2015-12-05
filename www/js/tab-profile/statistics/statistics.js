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
            },
            usersRuns: function (UserFactory, Session) {
                return UserFactory.fetchAllRuns(Session.user._id);
            },
            usersGhosts: function (UserFactory, Session) {
                return UserFactory.fetchAllGhosts(Session.user._id);
            }
        }
    });
});

app.controller('StatisticsCtrl', function ($scope, user, averagePace, averageDistance, usersRuns, usersGhosts, StatFactory) {
    $scope.user = user;
    $scope.numRuns = usersRuns.length;
    $scope.numGhosts = usersGhosts.length;

    $scope.averagePaceKm = averagePace;
    $scope.averagePaceMi = StatFactory.convertPaceMetricToMiles($scope.averagePaceKm);
    $scope.averageDistanceKm = averageDistance;
    $scope.averageDistanceMi = StatFactory.convertDistanceMetricToMiles($scope.averageDistanceKm);
});