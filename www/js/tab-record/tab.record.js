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
    var interv;

    $scope.start = function () {
        // TODO: fix the need for $interval to update run data below

        LocationFactory.startNewRun();
        $scope.testing = LocationFactory.getCurrentRunData();
        $scope.testing.running = true;
        $scope.lastInd = LocationFactory.getLocIndex();

        // testing
        interv = $interval(function () {
            $scope.testing = LocationFactory.getCurrentRunData();
            $scope.lastInd = LocationFactory.getLocIndex();
            // console.log($scope.testing);
            $scope.counter++;
        },1000)
    }
    $scope.stop = function () {
        $interval.cancel(interv);
        interv = undefined;
        LocationFactory.stopRun(Session.user._id).then(function(stopData){
                $scope.testing = stopData;
                $scope.lastInd = $scope.testing.locations.length-1
                $scope.testing.running = false;
        });
        console.log("STOPPED" , $scope.testing.locations[0])
    }
});
