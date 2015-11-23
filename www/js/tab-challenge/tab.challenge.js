app.config(function ($stateProvider) {
	$stateProvider.state('tab.challenge', {
        url: '/challenge',
        data: {
            authenticate: true
        },
        views: {
        	'tab-challenge': {
           		templateUrl: 'js/tab-challenge/tab.challenge.html',
            	controller: 'ChallengeCtrl'
        	}
        }
	});
});

app.controller('ChallengeCtrl', function ($scope) {
    $scope.something = "Hello we are in Challenge!"
});
