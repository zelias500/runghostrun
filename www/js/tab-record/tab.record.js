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

app.controller('RecordCtrl', function ($scope, $state, $rootScope, $interval, LocationFactory, Session, ValidationFactory, $ionicPopup) {
    $scope.lastLocIndex;
    $scope.currentRun;
    $scope.challengedGhost = LocationFactory.getGhost();
    $scope.barColor = "bar-balanced";
    var interv;

    $scope.start = function () {
        if ($scope.challengedGhost) {
            if (!ValidationFactory.validateChallengeStart($scope.challengedGhost)) {
                var warning = $ionicPopup.confirm({
                    title: 'Invalid Challenge Start',
                    template: 'Invalid start location for this challenge. Continue as new ghost?'
                })
                warning.then(res => {
                    if (res) {
                        delete $scope.challengedGhost;
                    }
                    else return;
                })
            }
            $rootScope.$emit('startChallenge')
        }
        else $rootScope.$emit('start');


        $scope.barColor = "bar-assertive"
        LocationFactory.startNewRun();
        $scope.currentRun = LocationFactory.getCurrentRunData();
        $scope.lastInd = LocationFactory.getLocIndex();

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
        $state.go('tab.challenge');
    }
});
