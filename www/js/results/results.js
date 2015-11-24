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

app.controller('ResultsCtrl', function ($scope, LocationFactory, $stateParams, MapFactory, $timeout) {
    $scope.stopData = LocationFactory.getStopData();
    $scope.something = "Hello we are in More!"
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

});
