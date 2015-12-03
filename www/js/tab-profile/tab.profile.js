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
        resolve: {
            me: function (UserFactory, $stateParams) {
                return UserFactory.fetchById($stateParams.id);
            }
        }
    })
});

app.controller('ProfileCtrl', function ($scope, $state, $timeout, me, UserFactory, Session) {
    $scope.me = me;
    console.log(me)
    $scope.numFriends = me.friends.length;
    $scope.numFollowers = me.followers.length;
    $scope.numGhosts = me.ghosts.length;
    $scope.numRuns = me.runs.length;
    if(me.displayName.length){
        $scope.name = me.displayName
    }
    else{
        $scope.name = me.email
    }

    $scope.notMe = function () {
        return !(me._id === $scope.userId);
    }
    $scope.isFriend = function (id) {
        return Session.user.friends.indexOf(id) !== -1;
    }

    $scope.addFriend = function () {
        return UserFactory.addFriend($scope.userId, $scope.me._id)
        .then(function () {
            $scope.successMessage = $scope.me.email + ' added to your friends list!';
            $timeout(function () {
                $scope.successMessage = false;
            }, 3000);
        });
    }
    $scope.removeFriend = function () {
        return UserFactory.removeFriend($scope.userId, $scope.me._id)
        .then(function () {
            $scope.successMessage = $scope.me.email + ' Removed from your friends list.';
            $timeout(function () {
                $scope.successMessage = false;
            }, 3000);
        });
    }

});