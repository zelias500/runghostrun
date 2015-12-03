app.config(function ($stateProvider) {
	$stateProvider.state('landing', {
        url: '/landing/',
        data: {
            authenticate: true
        },
        templateUrl: 'js/landing/landing.html',
        controller: 'LandingCtrl',
        params: {
        	identity: null,
        	data: null
        }
    });
});

app.controller('LandingCtrl', function ($rootScope, $scope, $state, $stateParams) {
	$scope.runData = $stateParams.data;
	$scope.isGhost = $stateParams.identity === 'ghosts';
	$scope.goHome = function () {
		$state.go('tab.home');
	}

});