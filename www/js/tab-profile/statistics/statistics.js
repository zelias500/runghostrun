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


app.controller('StatisticsCtrl', function ($scope, user, averagePace, averageDistance, usersRuns, usersGhosts, StatFactory, SettingFactory, d3Factory, Session) {
    $scope.user = user;
    $scope.numRuns = usersRuns.length;
    $scope.numGhosts = usersGhosts.length;
    $scope.date = "";

    $scope.averagePaceKm = averagePace;
    $scope.averagePaceMi = StatFactory.convertPaceMetricToMiles($scope.averagePaceKm);
    $scope.averageDistanceKm = averageDistance;
    $scope.averageDistanceMi = StatFactory.convertDistanceMetricToMiles($scope.averageDistanceKm);

    if (Session.user.isMetric) $scope.useKm = true;
    else $scope.useMi = true;

    $scope.runs = usersRuns.slice(-5)
    $scope.statSelector = 'Recent Distance'

    $scope.changeStat = function(statSelector) {
        $scope.d3Selected = d3Factory.getStatsAbout(statSelector, $scope.runs, user.isMetric);
    }
    $scope.changeStat($scope.statSelector);

    if($scope.runs && $scope.runs.length){
       $scope.date = moment($scope.runs[$scope.runs.length-1].timestamp).format('L');
    }
});
