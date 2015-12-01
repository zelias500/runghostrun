app.config(function($stateProvider){
	$stateProvider.state('tab.pastghosts', {
        url: '/pastghosts',
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
            ghosts: function (UserFactory, Session) {
                return UserFactory.fetchAllGhosts(Session.user._id);
            }
        }
    });
});

app.controller('PastGhostsCtrl', function ($scope, $state, ghosts) {
    $scope.ghosts = ghosts;
});