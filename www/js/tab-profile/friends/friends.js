app.config(function($stateProvider){
	$stateProvider.state('tab.friends', {
        url: '/friends',
        data:{
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/friends/friends.html',
                controller: 'friendsCtrl'
            }
        },
        resolve: {
            friends: function (UserFactory, Session) {
                return UserFactory.fetchAllFriends(Session.user._id);
            }
        }
    });
});

app.controller('friendsCtrl', function ($scope, friends, $state) {
    $scope.friends = friends;
    $scope.goFriendPage = function (friendId) {
      $state.go('tab.friend.profile', {id: friendId})
    }
});
