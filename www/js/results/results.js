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



app.controller('ResultsCtrl', function ($rootScope, $scope, $state, LocationFactory, $stateParams, MapFactory, $timeout, TimeFactory, ValidationFactory, $ionicPopup) {
    $scope.stopData = LocationFactory.getStopData(); // data from the run
    console.log('stopdata', $scope.stopData);
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
        confirmPopup.then(function(res){
            if (res) {
                delete $scope.stopData.ghost;
                $scope.executeSave();
            }
            else {
                $scope.discard();
            }
        })
    }

    $scope.executeSave = function() {
         LocationFactory.saveRun($rootScope.userId, $scope.stopData)
        .then(function (runOrGhost) {
            // if its a ghost
            if (runOrGhost.time) $state.go('tab.ghost', {gid: runOrGhost._id});
            else $state.go('tab.ghost', {gid: runOrGhost.ghost});
        });     
    }

    $scope.discard = function() {
        LocationFactory.emptyStopData();
        $state.go('tab.home');
    }

});
