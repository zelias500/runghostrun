window.app = angular.module('starter', ['ionic'])

app.config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.when('/', '/home')
    $locationProvider.html5Mode(true);
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
})
