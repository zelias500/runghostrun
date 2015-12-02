app.config(function ($stateProvider) {
	$stateProvider.state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'js/tab-home/tab.home.html',
                controller: 'HomeCtrl'   
            }
        },
        data: {
            authenticate: true
        },
        resolve: {
            runs: function (UserFactory, Session) {
                return UserFactory.fetchAllRuns(Session.user._id);
            },
            friendGhosts: function(UserFactory, Session) {
                return UserFactory.fetchRecentFriendData(Session.user._id);
            }
        }
    });
});

app.controller('HomeCtrl', function ($scope, runs, Session, friendGhosts) {
    $scope.user = Session.user;

    $scope.recentRuns = runs.sort((a,b) => {
        return a.timestamp > b.timestamp
    }).slice(0, 3);

    $scope.friendGhosts = friendGhosts;

    $scope.recentTab = 'tmk-active';
    $scope.friendTab = '';
    $scope.toggle = function (bool) {
        if (bool) {
            $scope.recentTab = 'tmk-active';
            $scope.friendTab = '';
        } else {
            $scope.recentTab = '';
            $scope.friendTab = 'tmk-active';
        }
    }

    $scope.timeStampToReadable = function(timestamp){

    }
});
