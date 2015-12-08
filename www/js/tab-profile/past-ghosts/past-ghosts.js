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

    if (user.displayName && user.displayName.length) {
        $scope.name = user.displayName;
    } else $scope.name = user.email;
    
    $scope.notMe = function () {
        return !($stateParams.id === $scope.userId);
    }


});