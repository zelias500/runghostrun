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
    })
});

app.controller('HomeCtrl', function ($scope, ghosts) {
    $scope.something = "Hello we are in Home!"
    $scope.googleMapsUrl = 'http://maps.google.com/maps/api/js?v=3.20&client=AIzaSyAll4lFrjQHmozCEhpwsDIH6AKlkySPQzw';
    
    $scope.wayPoints = [];

   ghosts[0].locations.forEach(function(ele){
        console.log(ele)
       $scope.wayPoints.push({
        locations: {
            lat: ele.lat,
            lng: ele.lng
        }
    })
   });
   console.log($scope.wayPoints)
   $scope.center = $scope.wayPoints[0].locations.lat + ', ' + $scope.wayPoints[0].locations.lng;
   $scope.dest = $scope.wayPoints[2].locations.lat + ', ' + $scope.wayPoints[2].locations.lng;
   console.log($scope.center);
   console.log($scope.dest);

});
