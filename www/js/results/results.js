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

});
