app.config(function ($stateProvider) {
	$stateProvider.state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'js/tab-home/tab.home.html',
                controller: 'HomeCtrl'   
            }
        },
        data: {
            authenticate: true
        },
        resolve: {
            ghosts: function (GhostFactory) {
                return GhostFactory.fetchAll();
            }
        }
    });
});

app.controller('HomeCtrl', function ($scope, ghosts, MapFactory, Session) {
    $scope.something = "Hello we are in Home!";
    $scope.user = Session.user;

    // testing
    var theGhost = ghosts[ghosts.length - 1];

    var map = MapFactory.newMap(theGhost);
    $scope.wayPoints = map.wayPoints;
    $scope.center = map.center
    $scope.dest = map.destination;
    $scope.googleMapsUrl = map.url;
    $scope.mode = map.mode;
    $scope.draggable = map.draggable;
});
