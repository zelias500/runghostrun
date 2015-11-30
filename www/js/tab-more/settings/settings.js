app.config(function($stateProvider){
	$stateProvider.state('tab.settings', {
        url: '/settings',
        data:{
            authenticate: true
        },
        views:{
            'tab-more': {
                templateUrl: 'js/tab-more/settings/settings.html',
                controller: 'SettingsCtrl'
            },
        }
    });
});

app.controller('SettingsCtrl', function ($scope, $state) {

});