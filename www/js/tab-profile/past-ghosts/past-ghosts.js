app.config(function ($stateProvider) {
	$stateProvider.state('tab.pastghosts', {
        url: '/pastghosts/:id',
        data:{
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/past-ghosts/past-ghosts.html',
                controller: 'PastGhostsCtrl'
            }
        },
        resolve: {
            user: function (UserFactory, $stateParams) {
                return UserFactory.fetchById($stateParams.id);
            },
            ghosts: function (UserFactory, $stateParams) {
                return UserFactory.fetchAllGhosts($stateParams.id);
            }
        }
    });
});

app.controller('PastGhostsCtrl', function ($scope, user, ghosts, GhostFactory, UserFactory, Session, $stateParams) {

    $scope.user = user;
    $scope.ghosts = ghosts;

    console.log(user.friends)

    if (user.displayName && user.displayName.length) {
        $scope.name = user.displayName;
    } else $scope.name = user.email;

    $scope.notMe = function () {
        return !($stateParams.id === $scope.userId);
    }

    $scope.sessionUserIsAuthorized = function (ghost) {
        if (ghost.privacy === "private") return false;
        if (ghost.privacy === "friends" && user.friends.indexOf(Session.user._id) !== -1) return true;
        if (ghost.privacy === "friends" && user.friends.indexOf(Session.user._id) === -1) return false;
        return true;
    }


});