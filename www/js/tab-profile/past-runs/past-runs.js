app.config(function($stateProvider){
	$stateProvider.state('tab.pastruns', {
        url: '/pastruns',
        data:{
            authenticate: true
        },
        views:{
            'tab-profile': {
                templateUrl: 'js/tab-profile/past-runs/past-runs.html',
                controller: 'PastRunsCtrl'
            },
        }
    });
});

app.controller('PastRunsCtrl', function ($scope, $state) {

});