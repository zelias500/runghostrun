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

app.controller('ProfileCtrl', function ($scope, $state, me, UserFactory, Session) {
    $scope.me = me;
    $scope.numFriends = me.friends.length;
    $scope.numFollowers = me.followers.length;
    $scope.numGhosts = me.ghosts.length;
    $scope.numRuns = me.runs.length;

    $scope.notMe = function () {
        return !(me._id === $scope.userId);
    }
    $scope.isFriend = function (id) {
        return Session.user.friends.indexOf(id) !== -1;
    }

    $scope.addFriend = function () {
        return UserFactory.addFriend($scope.userId, $scope.me._id)
        .then(function () {
            $scope.successMessage = $scope.me.email + ' added to your friends list!'
        });
    }
    $scope.removeFriend = function () {
        return UserFactory.removeFriend($scope.userId, $scope.me._id)
        .then(function () {
            $scope.successMessage = $scope.me.email + ' Removed from your friends list.'
        });
    }

});