app.config(function ($stateProvider) {
	$stateProvider.state('tab.profile', {
        url: '/profile/:id',
        cache:false,
        data: {
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/tab.profile.html',
                controller: 'ProfileCtrl'
            }
        },
        resolve:{
            me: function (UserFactory, $stateParams) {
                return UserFactory.fetchById($stateParams.id);
            }
            // allGhost: function (UserFactory, $stateParams) {
            //     return UserFactory.fetchAllChallenges($stateParams.id);
            // },
            // allFriends:function (UserFactory, $stateParams) {
            //     return UserFactory.fetchAllFriends($stateParams.id);
            // },
            // averagePace: function (UserFactory, $stateParams) {
            //     return UserFactory.fetchAvgPace($stateParams.id);
            // }
            // averageDis: function (UserFactory, $stateParams) {
            //     return UserFactory.fetchAvgDis($stateParams.id);
            // }
        }
    })
});

app.controller('ProfileCtrl', function ($scope, me, UserFactory, $state) {
    $scope.me = me;
    $scope.numFriends = me.friends.length;
    $scope.numFollowers = me.followers.length;
    $scope.numRuns = me.ghosts.length;
    $scope.notMe = function () {
        return !(me._id === $scope.userId);
    }

    console.log(me);

    // $scope.successMessage;

    // $scope.$on('$ionicView.enter', function(scopes, states) {
    //     if (states.stateParams.id != $scope.userId && states.direction == 'swap') {
    //         $state.go($state.current, {id: $scope.userId}, {reload: true})
    //     }
    // })

    // $scope.friends = allFriends

    // $scope.myghosts = allGhost

    // $scope.noGhost = false;
    // if (! $scope.myghosts.length) $scope.noGhost = true;

    // $scope.myRecentGhost = allGhost[allGhost.length-1]


    // $scope.avgPace = Math.floor(averagePace*60) || 0// unit: km/min
    // $scope.avgDis = Math.floor(averageDis) || 0// unit: km

    // if($scope.friends && $scope.friends.length){
    //     $scope.friends = allFriends.slice(0,3)
    // }

    // $scope.addToFd = function () {
    //     return UserFactory.createFriend($scope.userId, $scope.me._id).then(function() {
    //         $scope.successMessage = $scope.me.email + ' added to your friends list!'
    //     });
    // }

});