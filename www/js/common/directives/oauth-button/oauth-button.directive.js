'use strict';

app.directive('oauthButton', function () {
	return {
		scope: {
			providerName: '@'
		},
		restrict: 'E',
		templateUrl: '/js/common/directives/oauth-button/oauth-button.html',
		link: function (scope) {
			if (scope.providerName === 'google') {
				scope.buttonColor = 'button-assertive';
				scope.buttonIcon = 'ion-social-google'	
			}
			if (scope.providerName === 'facebook') {
				scope.buttonColor = 'button-positive';
				scope.buttonIcon = 'ion-social-facebook'
			}
		}
	}
});