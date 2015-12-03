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
            user: function (UserFactory, $stateParams) {
                return UserFactory.fetchById($stateParams.id);
            }
        }
    })
});

app.controller('ProfileCtrl', function ($scope, $state, $timeout, user, UserFactory, Session) {
    $scope.user = user;
    $scope.numFriends = user.friends.length;
    $scope.numFollowers = user.followers.length;
    $scope.numGhosts = user.ghosts.length;
    $scope.numRuns = user.runs.length;

    if (user.displayName && user.displayName.length) {
        $scope.name = user.displayName
    } else $scope.name = user.email

    $scope.notMe = function () {
        return !(user._id === $scope.userId);
    }
    $scope.isFriend = function (id) {
        return Session.user.friends.indexOf(id) !== -1;
    }

    $scope.addFriend = function () {
        return UserFactory.addFriend($scope.userId, $scope.user._id)
        .then(function () {
            Session.user.friends.push($scope.user._id);
            $scope.successMessage = $scope.user.email + ' added to your friends list!';
            $timeout(function () {
                $scope.successMessage = false;
            }, 3000);
        });
    }
    $scope.removeFriend = function () {
        return UserFactory.removeFriend($scope.userId, $scope.user._id)
        .then(function () {
            Session.user.friends = Session.user.friends.filter(friend => friend !== $scope.user._id);
            $scope.successMessage = $scope.user.email + ' Removed from your friends list.';
            $timeout(function () {
                $scope.successMessage = false;
            }, 3000);
        });
    }

});
