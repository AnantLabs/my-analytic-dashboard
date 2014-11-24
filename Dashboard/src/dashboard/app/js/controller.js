app.controller('DesignCtrl', function($rootScope, $scope, Dashboard) {

	if (!$rootScope.dashboard) {
		Dashboard.getMetadata(0);
	}

});

app.controller('ViewCtrl', function($rootScope, $scope, Dashboard) {

	if (!$rootScope.dashboard) {
		Dashboard.getMetadata(0);
	}

});

app.controller('VisualizeCtrl', function($rootScope, $scope, Dashboard) {

	if (!$rootScope.dashboard) {
		Dashboard.getMetadata(0);
	}
	
	Dashboard.getData(0);

});
