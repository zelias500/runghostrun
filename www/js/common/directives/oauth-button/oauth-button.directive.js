'use strict';

var options = {
	location: 'no'	
}

app.directive('oauthButton', function ($http, $cordovaInAppBrowser, $state) {
	return {
		scope: {
			providerName: '@'
		},
		restrict: 'E',
		templateUrl: '/js/common/directives/oauth-button/oauth-button.html',
		link: function (scope) {
			scope.authStuff = function(providerName){
				var loginWindow = $cordovaInAppBrowser.open('http://murmuring-brook-3057.herokuapp.com/auth/'+providerName,'_blank', options)

				// var loginWindow = $cordovaInAppBrowser.open('http://murmuring-brook-3057.herokuapp.com/auth/'+providerName,'_blank', options)
			}
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
