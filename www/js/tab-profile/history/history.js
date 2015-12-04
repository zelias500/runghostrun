app.config(function($stateProvider){
	$stateProvider.state('tab.history', {
        url: '/history',
        data:{
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/history/history.html',
                controller: 'HistoryCtrl'
            }
        },
        resolve: {
            runs: function (UserFactory, Session) {
                return UserFactory.fetchAllRuns(Session.user._id);
            }
        }
    });
});

app.controller('HistoryCtrl', function ($scope, runs) {
    var week = 604800000;       // milliseconds in a week
    var today = Date.now();     // milliseconds from the Unix epoch at the moment of execution

    $scope.runsLastWeek = runs.filter(run => today - Date.parse(run.timestamp) < week);
    $scope.runs = runs.filter(run => today - Date.parse(run.timestamp) > week);
});