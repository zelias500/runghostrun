app.config(function ($stateProvider) {
	$stateProvider.state('tab.profile', {
        url: '/profile',
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
            singleUser: function(UserFactory, Session){
                return UserFactory.fetchById(Session.user._id)
            }
        }
    });
});

app.controller('ProfileCtrl', function ($scope,singleUser) {

    $scope.me = singleUser

    $scope.myghosts = singleUser.ghosts;

    $scope.myRecentGhost = singleUser.ghosts[singleUser.ghosts.length-1] || "You dont't have any recent ghosts"

     console.log("single user", singleUser);
     console.log("single user", $scope.myghosts);
});
