'use strict';

var app = angular.module('visualizer', ['ngRoute','ui.sortable','ngResource','ngSanitize','ngGrid','ui','ui.bootstrap','angular-carousel','ngTouch']).
    config([ '$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
    	
//    	$locationProvider.html5Mode(true);
    	
      	$routeProvider.
      	
        when('/home', {templateUrl: 'visualizer/partials/home.html', controller: HomeCtrl}).
        when('/dashboard', {templateUrl: 'visualizer/partials/dashboard.html', controller: DashboardCtrl}).
        otherwise({redirectTo: '/dashboard'});
      	
		$httpProvider.interceptors.push(function($q, $rootScope, $location) {

			return {

					'request': function(config) {
						
						if(localStorage.Authentication) {
							$httpProvider.defaults.headers.common['Authentication'] = localStorage.Authentication;
						} else {
							delete $httpProvider.defaults.headers.common['Authentication'];
						}
						$rootScope.openLoadingModal();
						return config || $q.when(config);
					},

					'response': function (response) {
						$rootScope.closeLoadingModal();
				        return response || $q.when(response);
					},

					'responseError': function(rejection) {
	        	
						alert(rejection.data.exception.message);
						// return $q.reject(rejection);
						
						var status = rejection.status;
						var config = rejection.config;
						var method = config.method;
						var url = config.url;

//						if (status == 401) {
//							$rootScope.logout();
//						}
						
						if (status >= 500 && rejection.data.exception) {
							$rootScope.exception = rejection.data.exception;
							$rootScope.openModal('exception');
						}
						
						$rootScope.error = method + " on " + url + " failed with status " + status;
						$rootScope.closeLoadingModal();

						return $q.reject(rejection);
					}
				};
			});
		}
    ]);

/**
 * Declare global vars and functions which will be available in $scope of controllers
 * @param {Object} $rootScope
 */

app.run(function($rootScope, $http, $location, $resource) {
	
	$rootScope.template = {};
	$resource('visualizer/config/template-config.json').get(function(data){
		angular.forEach(data, function(value, key) {
			$rootScope.template[key]=value;
        });
	});
	
	$resource('visualizer/config/app-config.json').get(function(data){	
		$rootScope.appConfig = data;
	});
	
	$rootScope.API_BASE_URL = '/Publisher/api/data/';
	
	$rootScope.opts = {
	    backdropFade: true,
	    dialogFade:true
	};
	
	$rootScope.logout = function() {
		
		delete $rootScope.user;
		delete localStorage.username;
		delete $http.defaults.headers.common['Authentication'];
		delete localStorage.Authentication;
		
		$location.path("/login");
	};
	
	$rootScope.maximizedModalOpts = {
		    backdropFade: true,
		    dialogFade:true,
		    dialogClass: 'maximized-modal',
		    transitionClass: 'zoom'
	};
	
	$rootScope.openJITRules= function() {
		var JITURL= $rootScope.appConfig.JITURL + localStorage.Authentication;
		window.open(JITURL);
	};
	
	$rootScope.modal = { maximizedGrid : {} };
	
	$rootScope.openModal = function(option) {
		$rootScope.modal[option] = true;
	};
	
	$rootScope.closeModal = function(option) {
		$rootScope.modal[option] = false;
		$('.modal-backdrop').remove(); 
		$rootScope.closeLoadingModal();
	};
	
	$rootScope.openMaximizeGridModal = function(gridId){
		$rootScope.modal.maximizedGrid[gridId] = true;
	};
	
	$rootScope.closeMaximizeGridModal = function(gridId){
		$rootScope.modal.maximizedGrid[gridId] = false;
	};
	
	$rootScope.openLoadingModal = function() {
		$("#loadingModal").modal('show');
	};
	
	$rootScope.closeLoadingModal = function() {
		$("#loadingModal").modal('hide');
	};
	
    $rootScope.staticInfo = {};
    $rootScope.staticData = {};
    $rootScope.headerData = {};
    
});