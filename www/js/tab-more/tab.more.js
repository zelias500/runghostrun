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

app.controller('MoreCtrl', function ($scope, $state, AuthService) {
    $scope.logout = function () {
        AuthService.logout()
        .then(function () {
            $state.go('login');
        });
    }
});
