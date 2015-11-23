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

app.controller('RecordCtrl', function ($scope, LocationFactory, UserFactory, Session, $interval, MapFactory) {
    $scope.something = "Hello we are in Record!";
    $scope.counter = 0;
    $scope.lastLocIndex;
    $scope.currentRun;
    $scope.map;
    var interv;

    $scope.start = function () {
        // TODO: fix the need for $interval to update run data below

        LocationFactory.startNewRun();
        $scope.currentRun = LocationFactory.getCurrentRunData();
        $scope.map = MapFactory.newMap($scope.currentRun)
        $scope.currentRun.running = true;
        $scope.lastInd = LocationFactory.getLocIndex();

        // currentRun
        interv = $interval(function () {
            $scope.currentRun = LocationFactory.getCurrentRunData();

            if ($scope.currentRun.locations.length > $scope.map.wayPoints.length){
                var lastLocation = $scope.currentRun.locations[$scope.currentRun.locations-1];
                $scope.map.wayPoints.push({
                    location: {
                        lat: Number(lastLocation.lat),
                        lng: Number(lastLocation.lng)
                    },
                    stopover = false
                })
            }
            
            $scope.lastInd = LocationFactory.getLocIndex();
            // console.log($scope.currentRun);
            $scope.counter++;
        },1000)
    }
    $scope.stop = function () {
        $interval.cancel(interv);
        interv = undefined;
        LocationFactory.stopRun(Session.user._id).then(function(stopData){
                $scope.currentRun = stopData;
                $scope.lastInd = $scope.currentRun.locations.length-1
                $scope.currentRun.running = false;
        });
        console.log("STOPPED" , $scope.currentRun.locations[0])
    }
});
