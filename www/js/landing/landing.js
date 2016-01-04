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

function pick2Rand(str){
    return str[_.random(0, str.length)]+str[_.random(0, str.length)];
}

app.controller('LandingCtrl', function ($scope, $state, $stateParams, $timeout, GhostFactory, TimeFactory, $cordovaSocialSharing, $ionicPopup, UserFactory, Session) {
    var haveWeSaved = false;
	$scope.runData = $stateParams.data;
	$scope.isGhost = $stateParams.identity === 'ghosts';
    $scope.titleSavedMessage;
    $scope.runData.title = (Session.user.displayName || Session.user.email)+'-'+pick2Rand($scope.runData.timestamp);

	$scope.goHome = function () {
        if (!haveWeSaved && $scope.isGhost) {
            // var defaultTitle = $scope.run
            GhostFactory.update($scope.runData.ghost, {title: $scope.runData.title})
            .then(() => $state.go('tab.home'));
        } else $state.go('tab.home');
	}
    
    $scope.saveTitle = function () {
        haveWeSaved = true;
        GhostFactory.update($scope.runData.ghost, {title: $scope.runData.title})
            .then(function () {
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

    $scope.challenge = function () {
        UserFactory.challengeFriends(Session.user._id, $scope.runData.ghost)
            .then(function(){
                $ionicPopup.alert({
                    title: 'Challenge Sent!',
                    template: 'You have succesfully challenged your followers.'
                });            
            })
    }
});