app.config(function ($stateProvider) {
	$stateProvider.state('tab.record', {
        url: '/record',
        data: {
            authenticate: true
        },
        views: {
            'tab-record': {
                templateUrl: 'js/tab-record/tab.record.html',
                controller: 'RecordCtrl'
            }
        }
    });
});

app.controller('RecordCtrl', function ($scope, LocationFactory, UserFactory, Session, $interval) {
    $scope.something = "Hello we are in Record!";
    $scope.counter = 0;
    $scope.lastLocIndex;
    $scope.testing;

    $scope.start = function () {
        // TODO: fix the need for $interval to update run data below

        LocationFactory.startNewRun();
        $scope.testing = LocationFactory.getCurrentRunData();
        $scope.testing.running = true;
        $scope.lastInd = LocationFactory.getLocIndex();


        // TODO: figure out why this Promise block isn't being entered
        // LocationFactory.startNewRun().then(function(data){
        //     console.log("HELLO")
        //     console.log('DATA FROM CONTROLLER', data);
        //     $scope.testing = data;
        //     console.log($scope.testing);
        //     $scope.testing.running = true;
        // });

        // testing
        $interval(function () {
            $scope.testing = LocationFactory.getCurrentRunData();
            // console.log($scope.testing);
            $scope.counter++;
        },1000)
    }
    $scope.stop = function () {
        $scope.testing = LocationFactory.stopRun('564f57361d84c351e9d10215');
        $scope.lastLocIndex = $scope.testing.locations.length
        $scope.testing.running = false;
    }
});
