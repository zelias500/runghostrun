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
    var interv;

    $scope.start = function () {
        // TODO: fix the need for $interval to update run data below

        LocationFactory.startNewRun();
        $scope.currentRun = LocationFactory.getCurrentRunData();
        $scope.map = MapFactory.newMap()
        $scope.currentRun.running = true;
        $scope.lastInd = LocationFactory.getLocIndex();

        var gmap = new google.maps.Map(document.getElementById("RunMap"), {
            zoom: 12,
            center: $scope.map.center,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        })

        $scope.map.runPath.setMap(gmap);


        interv = $interval(function () {
            console.log("We are in the setInterval")
            $scope.currentRun = LocationFactory.getCurrentRunData();
            console.log("We are got the current data", $scope.currentRun);

            if ($scope.currentRun.locations.length > $scope.map.wayPoints.length){
                console.log("We are inside the if statement");

                var lastLocation = $scope.currentRun.locations[$scope.currentRun.locations.length-1];
                console.log("We are inside the if statement");
                $scope.map.addWayPoint(
                {
                    lat: Number(lastLocation.lat),
                    lng: Number(lastLocation.lng)
                })
                console.log("We added the waypoint", $scope.map.wayPoints);
                console.log("The bounds are", $scope.map.bounds);

                gmap.fitBounds($scope.map.bounds);
                console.log("We fit to the bounds");

                var lastWayPointIndex = $scope.map.wayPoints.length - 1;
                console.log("We updated the index to the bounds");
                // $scope.map.center = $scope.map.wayPoints[lastWayPointIndex]

            }

            $scope.lastInd = LocationFactory.getLocIndex();
            $scope.counter++;
            $scope.map.makePolyline();
            $scope.map.runPath.setMap(gmap);

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
    }
});
