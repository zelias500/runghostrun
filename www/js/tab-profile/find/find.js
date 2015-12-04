app.config(function($stateProvider){
	$stateProvider.state('tab.find', {
        url: '/find',
        data:{
            authenticate: true
        },
        views: {
            'tab-profile': {
                templateUrl: 'js/tab-profile/find/find.html',
                controller: 'FindCtrl'
            }
        },
        resolve: {
            users: function (UserFactory) {
                return UserFactory.fetchAll();
            }
        }
    });
});

app.controller('FindCtrl', function ($scope, users, Session) {
    $scope.users = users;
    $scope.myName = Session.user.email;
});