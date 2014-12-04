//
var app = angular.module('spa', [ 'ngRoute', 'ngResource', 'ui' ]).config(
		[ '$resourceProvider', '$locationProvider', '$routeProvider',
				function($resourceProvider, $locationProvider, $routeProvider) {

					// $locationProvider.html5Mode(true);

					$routeProvider.

					when('/home', {
						templateUrl : 'lib/spa/template/home.html',
						controller : 'HomeCtrl'
					}).//

					when('/subscribe', {
						templateUrl : 'app/template/subscribe/subscriber.html',
						controller : 'SubscribeCtrl'
					}).//

					when('/publish', {
						templateUrl : 'app/template/publish/publisher.html',
						controller : 'PublishCtrl'
					}).//

					when('/dashboard', {
						templateUrl : 'app/template/dashboard/dashboard.html',
						controller : 'DashboardCtrl'
					}).//

					when('/about', {
						templateUrl : 'lib/spa/template/about.html',
						controller : function HomeCtrl() {
						}
					}).

					otherwise({
						redirectTo : '/home'
					});

				} ]);