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

app.controller('ProfileCtrl', function ($scope,singleUser,Allghosts, UserFactory, Allfriends,Averagepace,Averagedis, $state) {
    $scope.successMessage;

    $scope.$on('$ionicView.enter', function( scopes, states){
        if (states.stateParams.id != $scope.userId && states.direction == 'swap'){
            $state.go($state.current, {id: $scope.userId}, {reload: true})
        }
    })

    $scope.friends = Allfriends.friends;
    $scope.me = singleUser
    $scope.notMe = function(){
        return !(singleUser._id == $scope.userId)
    }

    $scope.myghosts = Allghosts

    $scope.noGhost = false;
    if(! $scope.myghosts.length) $scope.noGhost = true;

    $scope.myRecentGhost = Allghosts[Allghosts.length-1]


    $scope.avgPace = Math.floor(Averagepace*60) || 0// unit: km/min
    $scope.avgDis = Math.floor(Averagedis) || 0// unit: km

    if($scope.friends.length){
        $scope.friends = Allfriends.friends.slice(0,3)
        console.log('all friends', Allfriends.friends)
    }

    $scope.addToFd = function(){
        return UserFactory.createFriend($scope.userId, $scope.me._id).then(function(){
            $scope.successMessage = $scope.me.email + ' added to your friends list!'
        })
    }

});