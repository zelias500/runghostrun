app.config(function($stateProvider){
	$stateProvider.state('tab.statistics', {
        url: '/statistics',
        data:{
            authenticate: true
        },
        views:{
            'tab-profile': {
                templateUrl: 'js/tab-profile/statistics/statistics.html',
                controller: 'StatisticsCtrl'
            },
        }
    });
});

app.controller('StatisticsCtrl', function ($scope, $state) {

});