app.config(function ($stateProvider) {
	$stateProvider.state('results', {
        url: '/results',
        data: {
            authenticate: true
        },
        templateUrl: 'js/results/results.html',
        controller: 'ResultsCtrl'
    });
});

app.controller('ResultsCtrl', function ($rootScope, $scope, $state, LocationFactory, $stateParams, MapFactory, $timeout, TimeFactory) {
    $scope.stopData = LocationFactory.getStopData(); // data from the run
    $scope.map = MapFactory.getMap(); // map data from the run

    // privacy controls
    $scope.privacySetting = "Friends";
    var privacySettingDiv = document.getElementById("privacySetting");
    $scope.checkTick = function (privacyRange) {
        if (privacyRange == 0) {
            $scope.privacySetting = "Public";
            privacySettingDiv.className = "button button-balanced  ng-binding";
        }
        if (privacyRange == 1) {
            $scope.privacySetting = "Friends";
            privacySettingDiv.className = "button button-positive ng-binding";
        }
        if (privacyRange == 2) {
            $scope.privacySetting = "Private";
            privacySettingDiv.className = "button button-energized ng-binding";
        }
    };

    $scope.save = function() {
        $scope.stopData.privacy = $scope.privacySetting.toLowerCase();
        LocationFactory.saveRun($rootScope.userId, $scope.stopData)
        .then(function (ghostData) {
            // if the run is being saved as a new ghost
            if (ghostData.runs.length === 1) $state.go('landing', {identity: 'ghosts', data: ghostData})
            else $state.go('landing', {identity: 'runs', data: ghostData.runs[ghostData.runs.length - 1]})
        });
    }

    $scope.discard = function() {
        LocationFactory.emptyStopData();
        $state.go('tab.home');
    }

});
