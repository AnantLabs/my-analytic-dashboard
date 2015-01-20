var app = angular.module('dashboard', [ 'spa' ]);

app.run(function($rootScope) {

	$rootScope.API_BASE_URL = '/DataMesh/api/1.0';
	//$rootScope.API_BASE_URL = 'http://my-data-mesh.appspot.com/api/1.0';

	$rootScope.dashboard = {};

	$rootScope.dashboard.datasources = [];
	
});