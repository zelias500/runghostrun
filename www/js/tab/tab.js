app.config(function ($stateProvider) {
	$stateProvider.state('tab', {
    	url: '/tab',
    	abstract: true,
    	templateUrl: 'js/tab/tab.html'
  	});
});

