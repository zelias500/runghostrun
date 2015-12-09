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



app.controller('ResultsCtrl', function ($rootScope, $scope, $state, LocationFactory, MapFactory, ValidationFactory, $ionicPopup) {
    $scope.stopData = LocationFactory.getStopData(); // data from the run
    $scope.map = MapFactory.getMap(); // map data from the run

    $scope.stopData.privacy = "Friends";

    $scope.save = function() {
        if (!$scope.stopData.ghost || ValidationFactory.validateRun($scope.stopData)){
            $scope.executeSave();
        }
        else {
            $scope.failedValidationPopup();
        }
    }

    $scope.failedValidationPopup = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Challenge validation failed!',
            template: "Your run doesn't match the ghost. Save as new ghost?"
        });
        confirmPopup.then(function (res) {
            if (res) {
                delete $scope.stopData.ghost;
                $scope.executeSave();
            }
            else {
                $scope.discard();
            }
        })
    }

    $scope.executeSave = function () {
        LocationFactory.saveRun($rootScope.userId, $scope.stopData)
        .then(function (data) {
            $state.go('landing', {run: data});
            var isChallenge = LocationFactory.getChallengeState();
            if (!isChallenge) $state.go('landing', {identity: 'ghosts', data: data})
            else $state.go('landing', {identity: 'runs', data: data})
        });     
    }

    $scope.discard = function () {
        LocationFactory.emptyStopData();
        $state.go('tab.home');
    }

});
