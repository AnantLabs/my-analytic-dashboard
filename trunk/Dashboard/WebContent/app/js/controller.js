app.controller('SubscribeCtrl', function($rootScope, $scope, Subscriber) {

	$scope.doExtract = function() {
		Subscriber.extract($scope.dashboard.datasource);
	};

});

app.controller('PublishCtrl', function($rootScope, $scope, Publisher) {

	$scope.doAnalyze = function() {
		Publisher.analyze($scope.dashboard.key, $scope.dashboard.value);
	};

});

app.controller('DashboardCtrl', function($rootScope, $scope, Dashboard) {

	// if (!$rootScope.dashboard) {
	// Dashboard.getMetadata(0);
	// }
	//
	// Dashboard.getData(0);

});