app.config(function($stateProvider){
	$stateProvider.state('tab.find', {
        url: '/find',
        data:{
            authenticate: true
        },
        views:{
            'tab-profile': {
                templateUrl: 'js/tab-profile/find/find.html',
                controller: 'FindCtrl'
            },
        }
    });
});

app.controller('FindCtrl', function ($scope, $state) {

});