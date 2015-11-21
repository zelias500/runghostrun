app.config(function ($stateProvider) {
	$stateProvider.state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'js/tab-home/tab.home.html',
                controller: 'HomeCtrl'   
            }
        },
        resolve: {
            ghosts: function (GhostFactory) {
                return GhostFactory.fetchAll();
            }
        }
    });
});

app.controller('HomeCtrl', function ($scope, ghosts, MapFactory) {
    $scope.something = "Hello we are in Home!"

    var map = MapFactory.newMap(ghosts[0]);
    $scope.wayPoints = map.wayPoints;
    $scope.center = map.center
    $scope.dest = map.destination;
    $scope.googleMapsUrl = map.url;
    $scope.mode = map.mode;
    $scope.draggable = map.draggable;
});
