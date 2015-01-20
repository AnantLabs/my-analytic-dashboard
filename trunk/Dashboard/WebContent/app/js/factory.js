app.factory('Subscriber', function($rootScope, $resource) {

	this.doIntegrate = function(datasource) {

		$resource($rootScope.API_BASE_URL + //
		'/subscribe/integrate/' + //
		datasource.type + '/' + datasource.name).//
		get(function(response) {
			$rootScope.dashboard.datasource = response.data;
			$rootScope.dashboard.datasources.push(response.data);
		});

	};

	this.doExtract = function(datasource) {

		$resource($rootScope.API_BASE_URL + //
		'/subscribe/extract/' + datasource).//
		get(function(response) {
			$rootScope.dashboard.headers = response.data.headers;
			$rootScope.dashboard.data = response.data.data;
		});

	};

	return this;

});

app.factory('Publisher', function($rootScope, $resource) {

	this.doAnalyze = function(key, value) {

		$resource($rootScope.API_BASE_URL + //
		'/publish/analyze/' + key + '/' + value).//
		get(function(response) {
			$rootScope.dashboard.keys = response.data.keys;
			$rootScope.dashboard.values = response.data.values;
		});

	};

	return this;

});

app.factory('Dashboard', function($rootScope, $resource) {

	/*
	 * this.getMetadata = function(dashboardId, $scope) {
	 * 
	 * $resource('app/config/dashboard.json').get(function(response) {
	 * 
	 * $rootScope.dashboard = response.dashboard;
	 * 
	 * }); };
	 * 
	 * this.getData = function() { };
	 */
	return this;

});