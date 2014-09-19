'use strict';

function HomeCtrl($http, $scope, $rootScope, $location, SupportData, $resource, Personalization,BreadCrumbsService) {
	$rootScope.currentScreenId="";
	BreadCrumbsService.startFresh("home");
	$rootScope.pageSize = 12;
	$rootScope.slideIndex = 0;
	
	if($rootScope.screenflow == undefined) {
		initConfig($resource, $rootScope);
	}
	
	greetLoginUser($rootScope);
	OptionBarRequired(false);
	initializeSorting($scope,$rootScope.homeConfig.homeConfigList,Personalization);
	
	
	 $scope.modifyApp = function(appname){
		 modifyApp(appname);
		 initializePagination($rootScope);
		 //Calling rest service to save the personalisation options on the server for saving apps added
		 Personalization.saveHomePersonalisationData("appsAdded", $rootScope.homeConfig.homeConfigList);
	 };
	
	 $scope.modifyFavorite = function(value) {
			modifyFavorite(value,$rootScope.homeConfig.homeConfigList);
			 //Calling rest service to save the personalization options on the server for saving favorite options
			Personalization.saveHomePersonalisationData("favoriteExpressProc");
	 };
	 

	 
     $scope.isSingleOption = function(link_list) {
    	 	if(link_list.length==1){
    	 		 $scope.openUrl(link_list[0].url , link_list[0].actionName);
    	 		 $scope.closeModal('menu');
    	 	}
     };
	 
	    
    $scope.navigate = function(url, target){
    	if(target) {
			$scope.menu = fillOptions($rootScope.homeConfig.homeConfigList,target);
			$rootScope.openModal('menu');
    	} else {
    		$location.path(url);
    	}
    };
    
    $rootScope.homeOption = {
    	backdropFade: true,
	    dialogFade:true,
    	dialogClass: "modal home"	
	};
    
    $rootScope.openUrl = function(url,actionName) {
    	if(actionName!=null){
    		$location.path(url + "/" + actionName);
    	}else{
    		$location.path(url);
    	}
    	
    	resetFlag($rootScope.modal);
    	
    };
    
    resetFlag($rootScope.modal);
    
	$rootScope.policyKey = '';
	
	setContentSize('home');
	initializePagination($rootScope);
}


function initConfig($resource, $rootScope) {
	
	$resource('visualizer/config/flow-config.json').get(function(data){
    	$rootScope.flow = data;
    });
	
	$resource('visualizer/config/banner-config.json').get(function(data){	
		$rootScope.bannerConfig = data;
	});
	
	$resource('visualizer/config/grid-config.json').get(function(data){	
		$rootScope.gridConfig = data;
	});
	
	$resource('visualizer/config/staticdatainfo-config.json').get(function(data){	
		$rootScope.staticdatainfoConfig = data;
	});
}