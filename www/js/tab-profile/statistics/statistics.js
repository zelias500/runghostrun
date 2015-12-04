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
            userRuns: function(UserFactory, Session){
                return UserFactory.fetchAllRuns(Session.user._id);
            }
        }
    });
});

app.controller('StatisticsCtrl', function ($scope, user, averagePace, averageDistance, StatFactory, userRuns) {
    $scope.user = user;
    $scope.numRuns = user.runs.length;
    $scope.numGhosts = user.ghosts.length;

    $scope.averagePaceKm = averagePace;
    $scope.averagePaceMi = StatFactory.convertPaceMetricToMiles($scope.averagePaceKm);
    $scope.averageDistanceKm = averageDistance;
    $scope.averageDistanceMi = StatFactory.km2mi($scope.averageDistanceKm);
    $scope.runs = userRuns.slice(-7)

    $scope.date = moment($scope.runs[$scope.runs.length-1].timestamp).format('L');

    $scope.options = {
            chart: {
                type: 'discreteBarChart',
                height: 300,
                margin : {
                    top: 20,
                    right: 30,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label; },
                y: function(d){return d.value; },
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.2f')(d);
                },
                duration: 10,
                xAxis: {
                    axisLabel: 'Run'
                },
                yAxis: {
                    axisLabel: 'Distance'
                }
            },
            title: {
                enable: true,
                text: 'Recent Run Distance'
            }
        };
    var count = 1;
    var distanceData = $scope.runs.map(function(run){

      var obj = {
         "label": count++,
         "value": run.distance || 0
        }
       return obj;
      })
    $scope.data = [
        {
            key: "You Run Distance",
            values: distanceData
        }
    ]
});