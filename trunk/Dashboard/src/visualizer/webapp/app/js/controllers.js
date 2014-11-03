'use strict';

function HomeCtrl($http, $scope, $rootScope, $location, $resource) {

	if ($rootScope.bannerConfig == undefined) {
		initConfig($resource, $rootScope);
	}

}

function initConfig($resource, $rootScope) {

	$resource('visualizer/config/banner-config.json').get(function(data) {
		$rootScope.bannerConfig = data;
	});

}