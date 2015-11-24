app.config(function ($stateProvider) {
	$stateProvider.state('tab.profile', {
        url: '/profile/:id',
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
            singleUser: function(UserFactory, $stateParams){
                return UserFactory.fetchById($stateParams.id)
            },
            Allghosts: function(UserFactory, $stateParams){
                return UserFactory.fetchAllChallenges($stateParams.id)
            },
            Allfriends:function(UserFactory, $stateParams){
                return UserFactory.fetchAllFriends($stateParams.id)
            },
            Averagepace: function(UserFactory, $stateParams){
                return UserFactory.fetchAvgPace($stateParams.id)
            },
            Averagedis: function(UserFactory, $stateParams){
                return UserFactory.fetchAvgDis($stateParams.id)
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
        },
        resolve:{
            allUser: function(UserFactory){
                return UserFactory.fetchAll()
            }
        }

    })
    .state('tab.fdprofile',{
        url:'/friendpage/:id',
        data:{
            authenticate:true
        },
        views:{
            'friendProfile':{
                templateUrl: 'js/tab-profile/tab.profile.html',
                controller: 'FriendProfileCtrl'
            }
        },
        resolve:{
            singleUser: function(UserFactory, $stateParams){
                return UserFactory.fetchById($stateParams.id)
            },
            Allghosts: function(UserFactory, $stateParams){
                return UserFactory.fetchAllChallenges($stateParams.id)
            },
            Allfriends:function(UserFactory, $stateParams){
                return UserFactory.fetchAllFriends($stateParams.id)
            },
            Averagepace: function(UserFactory, $stateParams){
                return UserFactory.fetchAvgPace($stateParams.id)
            },
            Averagedis: function(UserFactory, $stateParams){
                return UserFactory.fetchAvgDis($stateParams.id)
            }
        }
    })

});

app.controller('ProfileCtrl', function ($scope,singleUser,Allghosts, UserFactory, Allfriends,Averagepace,Averagedis) {

    $scope.friends = Allfriends.friends;
    $scope.me = singleUser


    $scope.myghosts = Allghosts

    $scope.noGhost = false;
    if(! $scope.myghosts.length) $scope.noGhost = true;

    $scope.myRecentGhost = Allghosts[Allghosts.length-1]

    $scope.avgPace = Averagepace ||''// unit: km/min
    $scope.avgDis = Averagedis || ''// unit: km

    if($scope.friends.length){
        $scope.friends = Allfriends.slice(0,3)

    }

    $scope.addToFd = function(id){
        console.log(id)
    }
     //console.log("single user", singleUser);
     //console.log("myghosts",  $scope.myghosts);
});
