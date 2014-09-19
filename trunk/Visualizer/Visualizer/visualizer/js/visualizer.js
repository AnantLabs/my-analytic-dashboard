'use strict';

/* App Module */

/**
 * Declare app and router
 */

var app = angular.module('visualizer', ['ngRoute','ui.sortable','ngResource','ngSanitize','ngGrid','ui','ui.bootstrap','angular-carousel','ngTouch']).
    config([ '$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {
    	
    	$locationProvider.html5Mode(true);
    	
      	$routeProvider.
      	
      	when('/login', {templateUrl: 'viewer/partials/login.html', controller: LoginCtrl}).

      	when('/screen/:screenId/:action', {templateUrl: 'viewer/partials/screen.html', controller: ScreenCtrl}).
        when('/screen/:screenId/:action/:typeActivity', {templateUrl: 'viewer/partials/nav_screen.html', controller: ScreenCtrl}).
        
        when('/home', {templateUrl: 'visualizer/partials/home.html', controller: HomeCtrl}).
        
        otherwise({redirectTo: '/home'});
      	
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
	        	
						var status = rejection.status;
						var config = rejection.config;
						var method = config.method;
						var url = config.url;

						if (status == 401) {
							$rootScope.logout();
						}
						
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
	
	$resource('app/config/template-config.json').get(function(data){
		$rootScope.template ={};
		angular.forEach(data, function(value, key) {
			$rootScope.template[key]=value;
        });
	});

	/*Reset error when a new view is loaded */
	$rootScope.$on('$viewContentLoaded', function() {
		delete $rootScope.error;
	});
	
	$resource('app/config/app-config.json').get(function(data){	
		$rootScope.appConfig = data;
	});
	
	$rootScope.opts = {
	    backdropFade: true,
	    dialogFade:true
	};
	
	$rootScope.logout = function() {
		delete $rootScope.user;
		delete localStorage.username;
		delete $http.defaults.headers.common['Authentication'];
		delete localStorage.Authentication;
		$rootScope.staticInfo = {};
		$rootScope.userPersonalBanner=$rootScope.appConfig.DefaultPersonalization.defaultBanner;
		$rootScope.userPersonalFont="";
		$rootScope.updateTheme($rootScope.appConfig.DefaultPersonalization.defaultTheme);
		$rootScope.updateOptionBarPosition($rootScope.appConfig.DefaultPersonalization.defaultOptionBar);
		
		resetFlag($rootScope.modal);
		
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
    
    personalization($rootScope);
    
    window.ngGrid.i18n['en'].ngPageSizeLabel = 'Displayed Rows:'; 
   
});

function safeApply($rootScope,isApply){
	if($rootScope.$$phase && isApply==true) {
		$rootScope.$apply();
	}
}