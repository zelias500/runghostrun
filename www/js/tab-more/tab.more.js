app.config(function ($stateProvider) {
	$stateProvider.state('tab.more', {
        url: '/more',
        data: {
            authenticate: true
        },
        views: {
            'tab-more': {
                templateUrl: 'js/tab-more/tab.more.html',
                controller: 'MoreCtrl'
            }
        }
    });
});

app.controller('MoreCtrl', function ($scope) {
    $scope.something = "Hello we are in More!"
});
