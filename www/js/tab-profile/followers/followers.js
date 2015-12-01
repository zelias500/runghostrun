app.config(function($stateProvider){
	$stateProvider.state('tab.followers', {
        url: '/followers',
        data:{
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/followers/followers.html',
                controller: 'FollowersCtrl'
            }
        },
        resolve: {
            followers: function (UserFactory, Session) {
                return UserFactory.fetchAllFollowers(Session.user._id);
            }
        }
    });
});

app.controller('FollowersCtrl', function ($scope, $state, followers) {
    $scope.followers = followers;
});