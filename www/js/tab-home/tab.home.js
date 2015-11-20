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
    $scope.something = "Hello we are in Home!"
});
