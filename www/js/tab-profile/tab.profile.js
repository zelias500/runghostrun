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
            },
            Allghosts: function(UserFactory, Session){
                return UserFactory.fetchAllChallenges(Session.user._id)
            },
            Allfriends:function(UserFactory, Session){
                return UserFactory.fetchAllFriends(Session.user._id)
            }
        }
    })
    .state('tab.friend', {
        url:'/friends',
        data:{
            authenticate:true
        },
        views:{
            'tab-profile': {
                templateUrl:'js/tab-profile/friends/friends.html',
                controller: 'FriendsCtrl'
            },

        }
    })
});

app.controller('ProfileCtrl', function ($scope,singleUser,Allghosts, UserFactory, Allfriends) {

    $scope.friends = Allfriends.friends;
    $scope.me = singleUser

    $scope.myghosts = Allghosts

    $scope.noGhost = false;
    if(! $scope.myghosts.length) $scope.noGhost = true;

    $scope.myRecentGhost = Allghosts[Allghosts.length-1]

    $scope.avgPace = UserFactory.fetchAvgPace(singleUser._id)||''// unit: km/min
    $scope.avgDis = UserFactory.fetchAvgDis(singleUser._id) || ''// unit: km

    if($scope.friends.length){
        $scope.friends = Allfriends.slice(0,3)

    }

     //console.log("single user", singleUser);
     //console.log("myghosts",  $scope.myghosts);
});
