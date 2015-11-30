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
    $scope.stopData = LocationFactory.getStopData();
    $scope.map = MapFactory.getMap();
    $scope.privacySetting = "Friends";
    var privacySettingDiv = document.getElementById("privacySetting");
    
    $scope.checkTick = function (privacyRange) {
        if (privacyRange == 0) {
            $scope.privacySetting = "Public";
            privacySettingDiv.className = "button button-balanced  ng-binding"
        }
        if (privacyRange == 1) {
            $scope.privacySetting = "Friends";
            privacySettingDiv.className = "button button-positive ng-binding"
        }
        if (privacyRange == 2) {
            $scope.privacySetting = "Private";
            privacySettingDiv.className = "button button-energized ng-binding"
        }
    };

    var gmap = new google.maps.Map(document.getElementById("RanMap"), {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    })
    
    if ($scope.map) {
        $scope.map.makePolyline();
        $scope.map.runPath.setMap(gmap);
        gmap.fitBounds($scope.map.bounds);
    }

    $scope.save = function() {
        $scope.stopData.privacy = $scope.privacySetting
        LocationFactory.saveRun($rootScope.userId, $scope.stopData)
        .then(function(runOrGhost){
            // if its a ghost
            if (runOrGhost.best) $state.go('tab.ghost', {gid: runOrGhost._id});
            else $state.go('tab.ghost', {gid: runOrGhost.ghost})
        })
    }

    $scope.discard = function() {
        LocationFactory.emptyStopData();
        $state.go('tab.home');
    }

});
