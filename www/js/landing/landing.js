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

app.controller('LandingCtrl', function ($scope, $state, $stateParams, $timeout, GhostFactory, $cordovaSocialSharing) {
	$scope.runData = $stateParams.data;
	$scope.isGhost = $stateParams.identity === 'ghosts';
    $scope.showTitleSavedAlert = false;
    $scope.saveTitleDisabled = false;
    $scope.titleSavedMessage;
	$scope.goHome = function () {
		$state.go('tab.home');
	}
    $scope.saveTitle = function () {
        $scope.saveTitleDisabled = true;
        GhostFactory.update($scope.runData._id, $scope.runData)
            .then(function (ghost) {
                $scope.showTitleSavedAlert = true;
                $scope.titleSavedMessage = "New Title Saved!";
                $timeout(function () {
                    $scope.saveTitleDisabled = false;
                    $scope.showTitleSavedAlert = false;
                }, 3000)
            }).then(null, function () {
                $scope.showTitleSavedAlert = true;
                $scope.titleSavedMessage = "Something went wrong! You can still modify the title in Settings.";
                $timeout(function () {
                    $scope.saveTitleDisabled = false;
                    $scope.showTitleSavedAlert = false;
                }, 3000)
            })
    }
    $scope.share = function() {
          window.plugins.socialsharing.
            .shareViaFacebook(null, null, "murmuring-brook-3057.herokuapp.com")
            .then(function(result) {
                console.log("SUCCESS!")
            }, function(err) {
                console.log("FAILURE!", err);
        });
    }

});