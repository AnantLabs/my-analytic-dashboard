app.controller('SubscribeCtrl', function($rootScope, $scope, Subscriber) {

	$scope.doIntegrate = function() {

		$scope.dashboard.datasource = {};

		var datasource = {
			"name" : $scope.dashboard.datasource_name,
			"type" : $scope.dashboard.datasource_type,
			"parmas" : [ $scope.dashboard.datasource_param0,
					$scope.dashboard.datasource_param1 ]
		};

		Subscriber.doIntegrate(datasource);
	};

	$scope.doExtract = function() {
		Subscriber.doExtract($scope.dashboard.datasource);
	};

});

app.controller('PublishCtrl', function($rootScope, $scope, Publisher) {

	$scope.doAnalyze = function() {
		Publisher.doAnalyze($scope.dashboard.key, $scope.dashboard.value);
	};

});

app.controller('DashboardCtrl', function($rootScope, $scope, Dashboard) {

	// if (!$rootScope.dashboard) {
	// Dashboard.getMetadata(0);
	// }
	//
	// Dashboard.getData(0);

});