app.config(function ($stateProvider) {
	$stateProvider.state('landing', {
        url: '/landing',
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

app.controller('LandingCtrl', function ($scope, $state, $stateParams, $timeout, GhostFactory, TimeFactory, $cordovaSocialSharing, $ionicPopup) {
	$scope.runData = $stateParams.data;
	$scope.isGhost = $stateParams.identity === 'ghosts';
    $scope.titleSavedMessage;

	$scope.goHome = function () {
        if (!$scope.runData.title && $scope.isGhost) {
            var defaultTitle = 'Run on ' + TimeFactory.parseDisplayDate($scope.runData.timestamp)
            GhostFactory.update($scope.runData.ghost, {title: defaultTitle})
            .then(() => $state.go('tab.home'));
        } else $state.go('tab.home');
	}
    
    $scope.saveTitle = function () {
        GhostFactory.update($scope.runData.ghost, {title: $scope.runData.title})
            .then(function (ghost) {
                $ionicPopup.alert({
                    title: 'New Title Saved!',
                    template: 'You saved your ghost as: ' + $scope.runData.title
                });
            })
            .then(null, function () {
                $ionicPopup.alert({
                    title: 'Something went wrong!',
                    template: 'You can still modify the title in Settings.'
                });
            });
    }

    $scope.share = function() {
          window.plugins.socialsharing
            .shareViaFacebook(null, null, "murmuring-brook-3057.herokuapp.com")
            .then(function(result) {
                console.log("SUCCESS!")
            }, function(err) {
                console.log("FAILURE!", err);
        });
    }

});