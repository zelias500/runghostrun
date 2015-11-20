app.config(function ($stateProvider) {
	$stateProvider.state('tab.record', {
        url: '/record',
        views: {
            'tab-record': {
                templateUrl: 'js/tab-record/tab.record.html',
                controller: 'RecordCtrl'
            }
        }
    });
});

app.controller('RecordCtrl', function ($scope) {
    $scope.something = "Hello we are in Record!"
});
