app.config(function($stateProvider){
	$stateProvider.state('tab.followers', {
        url: '/followers',
        data:{
            authenticate: true
        },
        views:{
            'tab-profile': {
                templateUrl: 'js/tab-profile/followers/followers.html',
                controller: 'FollowersCtrl'
            },
        }
    });
});

app.controller('FollowersCtrl', function ($scope, $state) {

});