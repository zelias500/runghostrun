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
    $scope.priceSlider = 150;
    $scope.rangeValue = "Public";
    var privacySettingDiv = document.getElementById("privacySetting");
    console.log(privacySettingDiv.className);


    $scope.checkTick = function (myRange) {
        if (myRange == 0) {
            $scope.rangeValue = "Public";
            privacySettingDiv.className = "button button-balanced  ng-binding"
        }
        if (myRange == 1) {
            $scope.rangeValue = "Friends";
            privacySettingDiv.className = "button button-positive ng-binding"
        }
        if (myRange == 2) {
            $scope.rangeValue = "Private";
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
        LocationFactory.saveRun($rootScope.userId, $scope.stopData)
        .then(function(user){
            $state.go('tab.ghost', {gid: user.ghosts[user.ghosts.length-1]});
        },
        function(){
        })
    }

    $scope.discard = function() {
        LocationFactory.emptyStopData();
        //MapFactory.emptyMapData();
        $state.go('tab.home');
    }

    $scope.privacyOptions = {
        value: 1,
        options: {
            stepsArray: 'Public,Friends,Private'.split(',')
        }
    };


});
