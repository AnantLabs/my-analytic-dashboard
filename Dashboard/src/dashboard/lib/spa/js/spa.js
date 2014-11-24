//
var app = angular.module('spa', [ 'ngRoute', 'ngResource', 'ui' ]).config(
		[ '$resourceProvider', '$locationProvider', '$routeProvider',
				function($resourceProvider, $locationProvider, $routeProvider) {

					// $locationProvider.html5Mode(true);

					$routeProvider.

					when('/home', {
						templateUrl : 'lib/spa/template/home.html',
						controller : function HomeCtrl() {
						}
					}).//

					when('/subscribe', {
						templateUrl : 'app/template	/subscriber.html',
						controller : function HomeCtrl() {
						}
					}).//
					
					when('/publish', {
						templateUrl : 'app/template	/publisher.html',
						controller : function HomeCtrl() {
						}
					}).//

					when('/dashboard', {
						templateUrl : 'app/template	/dashboards.html',
						controller : function HomeCtrl() {
						}
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