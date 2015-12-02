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

app.controller('RecordCtrl', function ($scope, LocationFactory, UserFactory, Session, $interval, MapFactory, $state, $rootScope) {
    $scope.lastLocIndex;
    $scope.currentRun;
    $scope.barColor = "bar-balanced";
    var interv;

    $scope.start = function () {
        $scope.barColor = "bar-assertive"
        LocationFactory.startNewRun();
        $scope.currentRun = LocationFactory.getCurrentRunData();
        $scope.lastInd = LocationFactory.getLocIndex();
        $rootScope.$emit('start');

        interv = $interval(function () {
            $scope.currentRun.time++;
            $scope.currentRun = LocationFactory.getCurrentRunData();
            $rootScope.$emit('tick');
        }, 1000);
    }

    $scope.stop = function () {
        $interval.cancel(interv);
        interv = undefined;
        $scope.currentRun = LocationFactory.stopRun(Session.user._id);
        $scope.lastInd = $scope.currentRun.locations.length - 1;
        $state.go("results");
    }

    $scope.ghost = function() {
        return LocationFactory.getGhost();
    }

    $scope.removeGhost = function() {
        LocationFactory.setGhost(null);
    }
});
