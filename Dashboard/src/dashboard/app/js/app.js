var app = angular.module('dashboard', [ 'spa' ]);

app.run(function($rootScope) {

	$rootScope.API_BASE_URL = '/Dashboard/api/1.0';

	$rootScope.dashboard = {};
	
});