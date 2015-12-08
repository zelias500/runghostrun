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

app.controller('StatisticsCtrl', function ($scope, user, averagePace, averageDistance, usersRuns, usersGhosts, StatFactory, SettingFactory, d3Factory) {
    $scope.user = user;
    $scope.numRuns = usersRuns.length;
    $scope.numGhosts = usersGhosts.length;


    $scope.averagePaceKm = averagePace;
    $scope.averagePaceMi = StatFactory.convertPaceMetricToMiles($scope.averagePaceKm);
    $scope.averageDistanceKm = averageDistance;
    $scope.averageDistanceMi = StatFactory.convertDistanceMetricToMiles($scope.averageDistanceKm);

    if (SettingFactory.getUnit() == 'km') $scope.useKm = true;
    if (SettingFactory.getUnit() =='mi') $scope.useMi = true;

    $scope.runs = usersRuns.slice(-5)
    $scope.statSelector = 'Recent Distance'
    console.log('test', $scope.runs)

    $scope.changeStat = function(statSelector) {
        $scope.d3Selected = d3Factory.getStatsAbout(statSelector, $scope.runs)        
    }
    $scope.changeStat($scope.statSelector);

    $scope.date = moment($scope.runs[$scope.runs.length-1].timestamp).format('L');



});
