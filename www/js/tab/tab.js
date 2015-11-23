'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('tab', {
    	url: '/tab',
    	abstract: true,
    	data: {
    		authenticate: true
    	},
    	templateUrl: 'js/tab/tab.html'
  	});
});
