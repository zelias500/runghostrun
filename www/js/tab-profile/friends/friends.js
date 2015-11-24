app.config(function($stateProvider){
	$stateProvider.state('tab.friend', {
        url:'/friends',
        data:{
            authenticate:true
        },
        views:{
            'tab-profile': {
                templateUrl:'js/tab-profile/friends/friends.html',
                controller: 'FriendsCtrl'
            },
        },
        resolve:{
            allUser: function(UserFactory){
                return UserFactory.fetchAll()
            }
        }

    })
})

app.controller('FriendsCtrl', function ($scope,allUser,$state) {
	// console.log(allUser);
   $scope.allusers = allUser;
   $scope.goFriendPage = function(fdid){
      $state.go('tab.friend.profile', {id: fdid})
   }
});