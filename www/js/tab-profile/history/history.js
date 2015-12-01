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

app.controller('HistoryCtrl', function ($scope, $state, runs) {
    $scope.runs = runs;
});