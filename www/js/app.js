window.app = angular.module('runghost', ['ionic', 'ngCordova', 'fsaPreBuilt'])

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $ionicConfigProvider) {

    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get('$state');
        $state.go('tab.home');
    });
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.scrolling.jsScrolling(false);

});

app.run(function ($ionicPlatform, $rootScope, AuthService, $state, Session, $cordovaGeolocation, $q, UserFactory) {

    $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

        // warm up the gps using $cordovaGeolocation, 
        // which already wraps geolocation.getCurrentPosition() in a promise for us
        function warmUp () {
            return setTimeout(function(){
                return $cordovaGeolocation.getCurrentPosition();
            }, 0)
        }
        // NOTE: the 'accuracy' reading on a Position object is NOT a percentage
        // instead, it refers to the # of meters the reading is accurate to
        // e.g. an accuracy of 20 means the reading is accurate w/in 20 meters @ 95% confidence level
        $q.all(warmUp(), warmUp(), warmUp()).then(() => {
            // accuracy has now drastically improved!
            return $cordovaGeolocation.getCurrentPosition();
        })
        .catch(console.error);

    });

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        console.log(toState)


        console.log(toState.url);
        console.log(toState.url === "/challege");
        if (toState.url === "/challenge") {
            if (Session.user) UserFactory.removeChallenges(Session.user._id);
            console.log("I am in challenge");
        }
        
        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $rootScope.userId = Session.user._id;
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });
    });

});
