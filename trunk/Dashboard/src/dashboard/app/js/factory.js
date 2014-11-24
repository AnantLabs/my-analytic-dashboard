app.factory('Dashboard', function($rootScope, $resource) {

	this.getMetadata = function(dashboardId, $scope) {

		$resource('app/config/dashboard.json').get(function(response) {

			$rootScope.dashboard = response.dashboard;

		});

	};

	this.getData = function() {
	};

	return this;

});