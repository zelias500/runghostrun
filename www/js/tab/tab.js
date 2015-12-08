'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('tab', {
    	url: '/tab',
    	abstract: true,
    	data: {
    		authenticate: true
    	},
    	templateUrl: 'js/tab/tab.html',
    	controller: 'TabCtrl'
  	});
});

app.controller('TabCtrl', function ($scope, Session) {
	$scope.user = Session.user;
	$scope.newChallengesLength = function (){
        if (!Session.user) return 0;
		if (Session.user.hasSeenChallenges) return 0;
		return Session.user.newChallenges.length;
	}
});