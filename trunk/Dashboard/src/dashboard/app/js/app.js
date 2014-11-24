var app = angular.module('dashboard', [ 'spa' ]);

app.run(function($rootScope) {

	$rootScope.API_BASE_URL = '/api/1.0';

});