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

app.controller('RecordCtrl', function ($scope, LocationFactory) {
    $scope.something = "Hello we are in Record!";

    LocationFactory.addLocationPoint({
        coords: {
            latitude: 40.703932,
            longitude: -74.009217
        },
        timestamp: 0
    })
    LocationFactory.addLocationPoint({
        coords: {
            latitude: 40.707110,
            longitude: -74.004588
        },
        timestamp: 100000
    })
    LocationFactory.calcDistance();
    LocationFactory.calcTime();
    console.log(LocationFactory.getCurrentRunData());
    console.log(LocationFactory.getAvgSpeed(true));
});
