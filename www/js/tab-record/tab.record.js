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

app.controller('RecordCtrl', function ($scope, LocationFactory, UserFactory, Session, $interval, MapFactory, $state) {
    $scope.lastLocIndex;
    $scope.currentRun;
    $scope.barColor = "bar-balanced";
    var interv;

    $scope.start = function () {
        $scope.barColor = "bar-assertive"
        // TODO: fix the need for $interval to update run data below


        $scope.currentRun = LocationFactory.getCurrentRunData();
        LocationFactory.startNewRun();
        $scope.map = MapFactory.newMap()
        $scope.lastInd = LocationFactory.getLocIndex();

        var gmap = new google.maps.Map(document.getElementById("RunMap"), {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        })

        $scope.map.runPath.setMap(gmap);

        interv = $interval(function () {
            $scope.currentRun.time++;

            $scope.currentRun = LocationFactory.getCurrentRunData();
            if ($scope.currentRun.locations.length > $scope.map.wayPoints.length){
                var lastLocation = $scope.currentRun.locations[$scope.currentRun.locations.length-1];
                $scope.map.addWayPoint(
                {
                    lat: Number(lastLocation.lat),
                    lng: Number(lastLocation.lng)
                })
                gmap.fitBounds($scope.map.bounds);
                var lastWayPointIndex = $scope.map.wayPoints.length - 1;
            }
            $scope.currentRun.avgPace = LocationFactory.getAvgSpeed();

            $scope.lastInd = LocationFactory.getLocIndex();
            $scope.map.makePolyline();
            $scope.map.runPath.setMap(gmap);

        },1000)
    }

    $scope.stop = function () {

        $interval.cancel(interv);
        interv = undefined;
        $scope.currentRun = LocationFactory.stopRun(Session.user._id)
        $scope.lastInd = $scope.currentRun.locations.length-1
        $state.go("results", {map: $scope.map});
    }

    $scope.ghost = LocationFactory.getGhost();

    $scope.removeGhost = function() {
        LocationFactory.setGhost(null);
    }
});
