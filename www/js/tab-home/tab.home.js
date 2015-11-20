app.config(function ($stateProvider) {
	$stateProvider.state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'js/tab-home/tab.home.html',
                controller: 'HomeCtrl'   
            }
        }
    })
});

app.controller('HomeCtrl', function ($scope) {
    $scope.something = "Hello we are in Home!";
    $scope.location = {};

    var posOptions = {
        timeout: 20000,
        enableHighAccuracy: true
    }
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position){
        console.log(position);
        $scope.location.latitude = position.coords.latitude;
        $scope.location.longitude = position.coords.longitude;
    }, function(err){console.error(err)})

});
