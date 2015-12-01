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

app.controller('HistoryCtrl', function ($scope, $state, runs, StatFactory) {
    var week = 604800000; // milliseconds in a week
    var today = Date.now(); // milliseconds from the Unix epoch at the moment of execution
    var runData = runs.map(run => {
        run.timestamp = Date.parse(run.timestamp);
        run.displayDate = parseDisplayDate(run.timestamp);
        run.averagePaceKm = StatFactory.minKm(run);
        run.averagePaceMi = StatFactory.minKm2minMi(run.averagePaceKm);
        return run;
    })

    function parseDisplayDate(date) {
        return new Date(date).toString().split(' ').slice(0, 4).join(' ');
    }

    $scope.runsLastWeek = runData.filter(run => today - run.timestamp < week);
    $scope.runs = runData.filter(run => today - run.timestamp > week);
});