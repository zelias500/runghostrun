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
				// return $http.get('/auth/'+providerName).then(function(res){
				// 	console.log(res);
				// 	console.log('hit-frontend');
				// })
				var requestToken;
				var loginWindow = $cordovaInAppBrowser.open('http://murmuring-brook-3057.herokuapp.com/auth/google','_blank', options)
				// $cordovaInAppBrowser.close();
				// .then(function(stuff){
					// console.log(loginWindow);
					// console.log('stuff', stuff);
					// loginWindow.close();
					// $state.go('home');
				// })
				// loginWindow.addEventListener('loadstart', function(event){
				// 	console.log(event);
				// 	var url = event.url;
				// 	requestToken = url.split('code=')[1];
				// })
				// .then(function(evt){
				// 	console.log(evt);
				// }).catch(function(e){alert(e)})
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