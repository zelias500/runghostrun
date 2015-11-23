app.config(function ($stateProvider) {
	$stateProvider.state('tab.profile', {
        url: '/profile',
        data: {
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/tab.profile.html',
                controller: 'ProfileCtrl'
            }
        }
    });
});

app.controller('ProfileCtrl', function ($scope) {
  $scope.something = "Hello we are in Profile!"
});
