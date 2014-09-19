'use strict';

/* Controllers */
var staticInfo = {};
function HeaderCtrl($scope, $rootScope, $resource) {
	
	if($rootScope.screenflow == undefined) {
		initConfig($resource, $rootScope);
	}
	
	//resource request to fetch static info data.
	$resource('app/config/staticinfo-config.json').get(function(data) {
		staticInfo = data;
    });
	greetLoginUser($rootScope);
}

function greetLoginUser($rootScope) {
	if(localStorage.Authentication  && $rootScope.user) {
		if(!$rootScope.staticInfo.greetingText) {
			$rootScope.staticInfo.greetingText = staticInfo.greetingText;
		}
		
		$rootScope.user.name = localStorage.username;
		$rootScope.staticInfo.separator = staticInfo.separator;
		$rootScope.staticInfo.logout = staticInfo.logout;
		$rootScope.staticInfo.JITRules = staticInfo.JITRules;
		$rootScope.staticInfo.Home = staticInfo.Home;
		$rootScope.staticInfo.currentdatelabel = staticInfo.currentdatelabel;
		$rootScope.staticInfo.overridedatelabel = staticInfo.overridedatelabel;
	}
}

function OptionBarRequired(value){
	if(value==false){
		$('#optionBar').addClass("hidden");
	}
	else if(value==true){
		$('#optionBar').removeClass("hidden");
	}
}

function LoginCtrl($scope, $rootScope, $location, $http, $resource) {
	$scope.submit = function() {
		$resource($rootScope.appConfig.BaseURL + '/authenticate', {},{
			'query' : {	method : "POST" ,  
						params: {username: $scope.inputUsername, password: $scope.inputPassword}, 
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}
		}).query(function(user){
			$rootScope.user = user;
			localStorage.username = user.name;
			$http.defaults.headers.common['Authentication'] = user.token;
			localStorage.Authentication = user.token;
			if(user.personalizationData){
				$rootScope.homeConfig = angular.fromJson(angular.fromJson(user.personalizationData).userhomescreen);
				$rootScope.userPersonalFont=angular.fromJson(user.personalizationData).userfont;
				$rootScope.updateTheme(angular.fromJson(user.personalizationData).usertheme);
				$rootScope.staticInfo.greetingText=angular.fromJson(user.personalizationData).usergreeting;
				$rootScope.userPersonalBanner=angular.fromJson(user.personalizationData).userbanner;
				$rootScope.updateOptionBarPosition(angular.fromJson(user.personalizationData).userOptionBar);
				$rootScope.favExpressOptions = angular.fromJson(user.personalizationData).favExpressOptions;
			}
			$location.path("/home");
		}, function(error){
			if(error.data.exception){
				showMessage(error.data.exception.message,"30");
			}
		});
	};
}

function PersonalizeCtrl($rootScope, $scope, Personalization) {
	
	$rootScope.personalizeOption = {
			backdropFade: true,
			dialogFade: true,
			dialogClass: "modal slideup personalize"
	};

	$rootScope.showAddAppMenu = function(){
		showAddAppMenu();
	};
	
	$scope.savePersonalizationData = function() {

		if($scope.userPersonalBanner==undefined){
			$scope.userPersonalBanner=$rootScope.appConfig.DefaultPersonalization.defaultBanner;
		}
		if($scope.userPersonalTheme==undefined){
			$scope.userPersonalTheme=$rootScope.appConfig.DefaultPersonalization.defaultTheme;
		}
		if($scope.userPersonalFont==undefined){
			$scope.userPersonalFont=$rootScope.appConfig.DefaultPersonalization.defaultFont;
		}
		if($rootScope.staticInfo.greetingText==undefined){
			$rootScope.staticInfo.greetingText=$rootScope.appConfig.DefaultPersonalization.defaultGreeting;
		}
		if($rootScope.userPersonalOptionBar==undefined){
			$rootScope.userPersonalOptionBar=$rootScope.appConfig.DefaultPersonalization.defaultOptionBar;
		}
		
		var userPersonalPayLoad = {"userBackgroundbanner" :$scope.userPersonalBanner, "userTheme":$scope.userPersonalTheme, "userFont":$scope.userPersonalFont, "userGreeting": $rootScope.staticInfo.greetingText , "userOptionBar": $rootScope.userPersonalOptionBar};
		Personalization.savePersonalizationData(userPersonalPayLoad);
	};
}