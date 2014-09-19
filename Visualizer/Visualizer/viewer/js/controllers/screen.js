'use strict';

var screenname ='';

function resetScreenData($rootScope, $browser, isApply){
	
	$browser.notifyWhenNoOutstandingRequests( function() { 
		validateFields();
	}); 

	var data = $rootScope.data;
	$rootScope.data = {};
	$rootScope.origData= {};
	safeApply($rootScope,isApply);

	$rootScope.data = data;
	$rootScope.origData= angular.copy($rootScope.data);
	safeApply($rootScope,isApply);
}


function onload($routeParams, $browser, $rootScope, $scope, ViewState, SupportData, action, metainfo) {
	$browser.notifyWhenNoOutstandingRequests( function() {
		
		$scope.metadata = metainfo.metadata;
		$scope.behavior = metainfo.behavior;
		
		if(!action.id){
			action.id = metainfo.screenId;
		}
		
		if (!$scope.$$phase) {
            $scope.$apply();
        }
		
		
		$rootScope.watchers=[];
		
		if (!action.name || ( action.name !='Search' && action.name !='List')) {
			
			ViewState.getRules(action.id, function(viewStateRules) {
				$rootScope.viewstate = $scope.viewstate = angular.fromJson($.trim(viewStateRules) == "" ? [] : viewStateRules).viewstate;
				checkViewState($rootScope,action);
				if ($scope.actionName == "Inquire" || $scope.actionName == "Delete") {
					disableForm(action);
				} else {
					disableFields(action);
					
				}
			});
			
		}
		attachBehavior($scope);
		
		
		$browser.notifyWhenNoOutstandingRequests( function() {
		
			setContentSize($scope.screenType);
			initiateEventBinding();
			checkCollapse();
			
			fetchSupportData($browser, $routeParams, $rootScope, $scope, SupportData, action);
			
		} );
	});
}

function populateStaticData(srcId, $rootScope, $scope, dataObject) {
	
	var newStaticDataInfo = $rootScope.staticdatainfoConfig[srcId];
	if(newStaticDataInfo) {
		$rootScope.staticData = {};
		
		$rootScope.staticData.IssueCode = $rootScope.data.BC_ISSUE_CODE;
		
		var staticDataInfo = newStaticDataInfo;
		$rootScope.origScreenId = srcId;
		
		for(var i = 0; i < staticDataInfo.length; i++) {
		
			$rootScope.staticData[staticDataInfo[i].field] = "";
			
			for(var j = 0 ; j < staticDataInfo[i].valueInfo.length; j++ ) {
				
				if(staticDataInfo[i].valueInfo[j].value) {
					$rootScope.staticData[staticDataInfo[i].field] += staticDataInfo[i].valueInfo[j].value; 
				} else {
					
					if(staticDataInfo[i].valueInfo[j].format == "true") {
						if(staticDataInfo[i].valueInfo[j].type=="date") {
							$rootScope.staticData[staticDataInfo[i].field] += formatDate(dataObject[staticDataInfo[i].valueInfo[j].fieldName ],"mm/dd/yy" );
						}
					}else{
						var fill = staticDataInfo[i].valueInfo[j].fill; 
						var length = staticDataInfo[i].valueInfo[j].length;
						if(fill){
							var padding = staticDataInfo[i].valueInfo[j].padding;
							if(padding=="left"){
								$rootScope.staticData[staticDataInfo[i].field] += padLeft(dataObject[staticDataInfo[i].valueInfo[j].fieldName], length, fill);
							}else{
								$rootScope.staticData[staticDataInfo[i].field] += padRight(dataObject[staticDataInfo[i].valueInfo[j].fieldName], length, fill);
							}
						}else{
							$rootScope.staticData[staticDataInfo[i].field] += dataObject[staticDataInfo[i].valueInfo[j].fieldName];
						}
					}
				}
			}
		}
	}
}


function buildLoadKey($rootScope, $routeParams, payLoad) {}

function displayPage($routeParams,$browser,$rootScope, $scope, Data, MetaData, ViewState, SupportData, action, type, onSuccess, prepBC) {
	if(action.payLoad && action.payLoad.REQUESTCODE!="BASLRARODELRq"){
		$scope.lastActionPerformed = action;
	}
	
	if(action.name == "Search"){
		$scope.searchPageId= action.id;
	}
	
	$scope.currentAction= action;
	
	if(type){
		angular.extend(action.payLoad, $rootScope.flow.screen[action.id][type].params);
		buildKey($rootScope, action);
	}

	if((action.name && action.name.search('List') != -1)) {
		$scope.actionName = 'List'; 
		$scope.listPageAction = action;
	} else {
		$scope.actionName = action.name;
	}
	
	// todo - remove action payload and merge with screen payload
	$rootScope.actionPayLoad = action.payLoad;

//	if($rootScope.currentScreenId != action.id) {

		MetaData.load($scope, action, function(m) {

			//$scope.currentScreenId = action.id;
			action.id = m.screenId;
			if (prepBC){
				$scope.scrObj = [];
				$scope.scrObj = action;			
				$scope.prepareBreadcrumbs($scope.scrObj, "pushBC", m.metadata.title);
			}
			
			if((action.name!="Delete") && (action.name!="Change") && (action.name!="Inquire") && (action.name!="Rewrite")) {
				if(action.payLoad && action.payLoad.REQUESTCODE){
					if(action.payLoad.REQUESTCODE.substring(8,11)=="INQ"){
						$scope.actionName="Inquire";
					} else if(action.payLoad.REQUESTCODE.substring(8,11)=="ADD"){
						$scope.actionName="Add";
					} else if(action.payLoad.REQUESTCODE.substring(8,11)=="CHG"){
						$scope.actionName="Change";
					} else if(action.payLoad.REQUESTCODE.substring(8,11)=="DLT"){
						$scope.actionName="Delete";
					}else if(action.payLoad.REQUESTCODE.substring(8,11)=="SUM"){
						$scope.actionName="List";
					}
				}
			}
			if(action.payLoad){
				action.payLoad.target = "jsp/"+m.screenId+".jsp";
				if($rootScope.data){
					$rootScope.data.KEY = action.payLoad.KEY;
					if(action.payLoad.REQUESTCODE && $.trim(action.payLoad.REQUESTCODE) != ""){
						$rootScope.data.REQUESTCODE = action.payLoad.REQUESTCODE;
					}else if ($.trim(action.payLoad.REQUESTCODE) == "" && m.ReqstCode){
						$rootScope.data.REQUESTCODE = m.ReqstCode;
						action.payLoad.REQUESTCODE = m.ReqstCode;
						$scope.actionName = action.name;
						$scope.listPageAction = undefined;
					}else{
						$rootScope.data.REQUESTCODE = action.payLoad.REQUESTCODE;
					}
				}
			}
			
			if(action.payLoad && action.payLoad.REQUESTCODE) {

				action.payLoad.method = "GET";
				action.payLoad.screenId = action.id;
				$rootScope.currentAction = action.name;

				Data.save(action.payLoad, function(data) {
					
					$rootScope.data.REQUESTCODE = action.payLoad.REQUESTCODE;
					$rootScope.data.KEY = action.payLoad.KEY;
					
					if($scope.currentScreenId){
						populateStaticData($scope.currentScreenId, $rootScope, $scope, $rootScope.data);
					}
					
					if($rootScope.flow.screen[action.id]) {
						
						var flow = $rootScope.flow.screen[action.id][action.name];
						
						if (flow && flow.success && flow.success.type=="navigate") { 
							
							if(action.name=="Cancel Policy and Rewrite Now" ) {
								updatePayLoadModule($rootScope);
							}
							
							if(flow.success.typeActivity){
								$routeParams.typeActivity = flow.success.typeActivity;
							}
							
							//$scope.applySuccessFlow( flow.success.typeActivity, flow);
							$scope.afterSave();
							
						}
						if (flow && flow.success && flow.success.type=="reload") {
							$scope.applySuccessFlow(flow.success.typeActivity, flow);
						}
					
					}
					onload($routeParams, $browser, $rootScope, $scope, ViewState, SupportData, action, m);
					
				});

			} else {
				onload($routeParams,$browser, $rootScope, $scope, ViewState, SupportData, action, m);
			}
			
			if(onSuccess){
	        	  onSuccess(m);
	         }
			
		});
//	} else {
//		if($rootScope.currentAction != action.name){					
//			$rootScope.data.REQUESTCODE = action.payLoad.REQUESTCODE;
//			$rootScope.data.KEY = action.payLoad.KEY;
//			$rootScope.currentAction = action.name;
//			onload($browser, $rootScope, $scope, ViewState, SupportData, action);		
//		}
//	}
          
}; 

function loadPage($routeParams, $rootScope, $scope){
	var screenflow = $rootScope.flow.screen[$routeParams.screenId];
	
	var payLoad = undefined;
	
	if(screenflow && screenflow.load) {
		payLoad = screenflow.load.params;
		payLoad.KEY = buildLoadKey($rootScope, $routeParams, payLoad);
	}
	
	var action = { "id": $routeParams.screenId, "name" : $routeParams.action, "payLoad" : payLoad };
	$scope.displayPage(action);
}

function applySuccessFlow($browser, $location,$routeParams, $rootScope, $scope, Data, MetaData, ViewState, SupportData, typeActivity, flow) {
	
	$routeParams.typeActivity=typeActivity;
	if(typeActivity=="QN" || typeActivity== "QR" || typeActivity== "CQ" || typeActivity== "RS" || typeActivity== "CQP" || typeActivity== "CQR"){
		if(flow.success.action=="Inquire" ){
			//updatePayLoad($rootScope);
			updatePayLoadKey($rootScope);
			$routeParams.typeActivity="EC";	
			
		}
	}
	
	if (flow.success.type == 'navigate') {
		
		if(typeActivity=="RB"){
			//updateRenewalKey($rootScope);
			updatePayLoadKey($rootScope);
		}
		
		$scope.$apply( $location.path('/screen/' + flow.success.id + '/' + flow.success.action + '/' + $routeParams.typeActivity) );
		//$location.path('/screen/' + flow.success.id + '/' + flow.success.action + '/' + $routeParams.typeActivity);		
	} 
	else if(flow.success.type == 'reload'){
		
		$scope.displayPage($scope.lastActionPerformed);
		
	}
	else {
		
		var payLoad = flow.success.params;
		
		if(payLoad) {
			payLoad.KEY = buildLoadKey($rootScope, typeActivity);
		}
		
		var action = { "id": flow.success.id, "name" : flow.success.action,  "payLoad" : payLoad };
		$scope.displayPage(action);
	}
	
};

function buildSubmitKey($rootScope, id) {
	var KEY;
	if(id=="RptStateSurcharge"){
		if($rootScope.data.RptOption=="S"){
			KEY=$rootScope.data.AcctgDate + $rootScope.data.RptOption + "0";
		}
		else{
			KEY=$rootScope.data.AcctgDate + "0" +  $rootScope.data.RptOption;
		}
		$rootScope.data.KEY_REQUIRED = true;
	}else{
		if(!$rootScope.policyKey)
			{
				return;
			}
		KEY = "\"" + $rootScope.policyKey;
		
		if(id == "CheckEndorsementDate" ) {
				KEY  = KEY + "                          " + formatDate($rootScope.data.ENDORSEMENT_EFFECTIVE_DATE);
				$rootScope.data.KEY_REQUIRED = true;
		}
		
		KEY = KEY + "\"";
	}
	return KEY;
}

function save($browser, $location, $rootScope, $scope, Data, MetaData, ViewState, SupportData) {

	var flow = $rootScope.flow.screen[$scope.currentScreenId];
	var screenflow ={};
	var mode = $scope.actionName;
	
	if($scope.currentScreenId=="WcpAuditCovgGrid" || $scope.currentScreenId=="WcpAuditPeriods" || $scope.currentScreenId=="WcpAuditCovgPolicyLevel"){
		$scope.tempData = $scope.data;
	}
	
	if($scope.currentScreenId=="UnitStatisticalReport" ){
		updatePayLoad($scope);
	}
	
	if($scope.currentScreenId=="WcpTransferUtility"){
		updateLossRepTransferData($rootScope);
	}
	
	if(flow){
		if(flow[mode]){
			screenflow = flow[mode];
		} else {
			screenflow = flow;
		}
	}
	
	if(!$scope.data.REQUESTCODE && $scope.actionPayLoad && $scope.actionPayLoad.REQUESTCODE){
		$scope.data.REQUESTCODE = $scope.actionPayLoad.REQUESTCODE;
	}
	
	if(screenflow && screenflow.submit) {
		angular.extend($rootScope.data, screenflow.submit.params);
		$rootScope.data.KEY  = buildSubmitKey($rootScope, $scope.currentScreenId);
	}
	
	$rootScope.data.screenId = $scope.currentScreenId;
	
	var key = $rootScope.data.KEY;
	if (!$rootScope.data.KEY_REQUIRED)
		{
			delete $rootScope.data.KEY;
		}
	
	$scope.beforeSave();
	
	Data.save($rootScope.data, function(data) {
		
		if(!data.KEY){
			data.KEY = key;
		}
		
		if($scope.currentScreenId=="WcpAuditCovgGrid" || $scope.currentScreenId=="WcpAuditPeriods" || $scope.currentScreenId=="WcpAddTrackingComments" || $scope.currentScreenId=="WcpAuditCovgPolicyLevel"){
			angular.extend($rootScope.data, $scope.tempData);
		}
		
		if($scope.currentScreenId){
			populateStaticData($scope.currentScreenId, $rootScope, $scope, $rootScope.data);
		}
		
		if(screenflow && screenflow.success) {
			$scope.applySuccessFlow(screenflow.success.typeActivity, screenflow);
		} else {
			window_onload($scope,$scope.metadata,SupportData,"afterSave");
			
		}
		
		if($scope.currentScreenId=="WcpPriorCarrierHistory"){
			$rootScope.fetchGridData("WcpPriorCarrierHistoryGrid");
		}
		
		if($scope.currentScreenId=="SelectivePICSProcessing"){
			if(data.RESPONSE_MESSAGE=="The record has been deleted successfully."){
				$rootScope.fetchGridData("SelectivePICSProcessingGrid");
			}
			if(!($scope.eventScope.activity && $scope.eventScope.activity.value=="DL")){
				var id=$scope.eventScope.eventId;
			if(id=="ID_Add_New_Records_Button"){
				var gridscope = angular.element($("#SelectivePICSProcessingGrid")).scope();
				var oldrow=[];
				var rowToshow=[];
				if(gridscope.gridData.length==undefined){
					oldrow[0]=(gridscope.gridData);
				}else{
					for(var i=0;i<=gridscope.gridData.length-1;i++){
							if(gridscope.gridData[i].ROW && gridscope.gridData[i].ROW!="NEW" || gridscope.gridData[i].ROW==undefined){
								oldrow.push(gridscope.gridData[i]);
						}
					}
				}
				if(data.gridData.length==undefined){
					if(data.gridData.RESPONSE_MESSAGE=="Success"){showMessage("1 record(s) inserted.", 10);}
					data.gridData.Location=padLeft(data.gridData.Location.toString(),2,"0");
					data.gridData.Policy=padLeft(data.gridData.Policy.toString(),7,"0");
					data.gridData.MasterCo=padLeft(data.gridData.MasterCo.toString(),2,"0");
					data.gridData.Module=padLeft(data.gridData.Module.toString(),2,"0");
					rowToshow[0]=(data.gridData);
				}else{
					var successCount=0;
					for(var i=0;i<=data.gridData.length-1;i++){
						if(data.gridData[i].RESPONSE_MESSAGE=="Success"){successCount++;}
						data.gridData[i].Location=padLeft(data.gridData[i].Location.toString(),2,"0");
						data.gridData[i].Policy=padLeft(data.gridData[i].Policy.toString(),7,"0");
						data.gridData[i].MasterCo=padLeft(data.gridData[i].MasterCo.toString(),2,"0");
						data.gridData[i].Module=padLeft(data.gridData[i].Module.toString(),2,"0");
						rowToshow.push(data.gridData[i]);
					}
					showMessage(successCount+"record(s) inserted.", 10);
				}
				for(var j=0;j<=oldrow.length-1;j++){
					rowToshow.push(oldrow[j]);
				}
				gridscope.gridData=rowToshow;
			}
			}
		}
		$scope.afterSave();
	});
};

function getDefaultAction (actions, value) {
  if (typeof(actions) != "undefined"){
	for(var i = 0; i < actions.length; i++) {
		if(actions[i].name.toLowerCase().search(value) != -1) {
			return actions[i];
		};
	};
  }
};


function ScreenCtrl($browser, $location, $routeParams, $rootScope, $scope, Data, GridData, MetaData, ViewState, SupportData, NavigationData,BreadCrumbsService, URLService) {
	
	$scope.showPreviousButton = false;
	
	OptionBarRequired(true);
	
	$scope.toggleFontSize = function(){
		toggleFontSize();
	};
	
	$scope.performActivity = function(scope) {
		
		resetFlag($rootScope.modal);
		
		$('#activitypopup').removeClass('active');
		
		if(!scope.activityKey) { scope.activityKey = scope.activity.key; }

		var typeActivity = scope.activityKey.substring(16,18);
		var activityflow = $rootScope.flow.activity[typeActivity];
		$scope.typeactivity = activityflow.success.type;
		
		$scope.applySuccessFlow(typeActivity, activityflow);
	};
	
	$scope.displayLastView = function(){
		var index = $scope.breadcrumbs.length -2;		
		var bc = $scope.breadcrumbs[index];
		var bc_id = "home";
		BreadCrumbsService.setLastIndex(bc_id, index);
        $scope.breadcrumbs = [];
          angular.forEach(BreadCrumbsService.get(bc_id), function(v) {
        	v.label = v.label.replace(/_/g, ' ');
        	v.label_short = v.label ;
          	if (v.label.length > 10){
          	v.label_short = v.label.substring(0,10);
          	v.label_short = v.label_short + "...";
          	}
          $scope.breadcrumbs.push(v);
        });
		if ($scope.breadcrumbs.length == 1){
			$scope.showPreviousButton = false;
		}
        $scope.displayNavigationActionBC(bc.screenObj,true);
	};
	
	$scope.displayParentPage = function(scope){	
         
		if($scope.searchPageId){
			var action = { "id": $scope.searchPageId, "name": "Search"};
			scope.displayPage(action);
		}
		else if($scope.listPageAction){
			scope.displayPage($scope.listPageAction);
		}
		$scope.showPreviousButton=false;
	};
	
	$scope.applySuccessFlow = function (typeActivity, activityflow) {
		applySuccessFlow($browser, $location,$routeParams, $rootScope, $scope, Data, MetaData, ViewState, SupportData, typeActivity, activityflow);
	};
	
	$scope.displayPage = function(action, type, onSuccess, contextMenuId, prepBC){
		if (typeof($('#' + contextMenuId ).get(0)) != undefined){
			$('#' + contextMenuId ).removeClass('active');
		}
		action = checkCommUnitScreen(action);
		
		displayPage($routeParams, $browser, $rootScope, $scope, Data, MetaData, ViewState, SupportData, action, type, onSuccess, prepBC);		
	
	};
	
	$scope.save = function (method) {
		//$rootScope.data.method = method;
		if($scope.actionName != "Search"){		
			save($browser, $location, $rootScope, $scope, Data, MetaData, ViewState, SupportData);
		}
	};
	
	$scope.designPage = function(){
		var url = $rootScope.appConfig.CanvasURL + "/" + $scope.currentScreenId + "/" + $rootScope.appConfig.SetType[$scope.currentScreenId];
		window.open(url);
	};
	
	$scope.launchURL = function(reqType, param){
		URLService.launchURL(reqType, param, $scope, function(url,scope){
			window.open(url);
		});
	};
	
	$scope.savePayload = function(payload, action2){
		Data.save(payload, function(data) {
			$scope.displayPage(action2, '', '', '', true);
		});
	};
	
	$scope.$watch('screenType', function () {
		
		if($scope.screenType == "screen") {
			
			$rootScope.data = {};
			
			$scope.beforeSave = function(){
				customBeforeSave($scope);
			};
			
			$scope.afterSave = function(){
				customAfterSave($scope);
			};
			
			loadPage($routeParams, $rootScope, $scope);
			
		} else if($scope.screenType == "nav_screen") {
			
			$scope.performAction = function(action) {
				
				$rootScope.defaultActionForGrids={};
				
				if(action.id != ""){
					$scope.displayPage(action);
				}else{
					var funcName = action.functionName;
					var key = action.functionParam;
					eval(funcName)(key, $scope, $routeParams, action);
				}
			}; 
			
			if($rootScope.policyKey == "") { // New
				
				$rootScope.policyKey = $rootScope.data.BC_KEY_LOCATION_COMPANY + $rootScope.data.BC_KEY_MASTER_COMPANY+ $rootScope.staticData.policyNumber;
				
				$rootScope.LOBPayLoad = {  BC_KEY_LOCATION_COMPANY : $rootScope.data.BC_KEY_LOCATION_COMPANY, BC_KEY_MASTER_COMPANY : $rootScope.data.BC_KEY_MASTER_COMPANY,
									BC_RISK_STATE : $rootScope.data.BC_RISK_STATE,BC_LINE_OF_BUSINESS : $rootScope.data.BC_LINE_OF_BUSINESS };
				
			}
			
			// Fetch Title
			fetchTitle($rootScope, SupportData);
			
			$scope.fetchNavigation = function() {
				
				//var reqData = {"payLoad": {"User" : "LAB01","PolicyKey": $rootScope.policyKey,"TypeActivity" : $routeParams.typeActivity, "EffectiveDate" : formatDate($rootScope.effectiveDate),"SecondParm" : "0"}};
				var secondParm = "0";
				if($rootScope.SecondParm){
					secondParm = $rootScope.SecondParm;
					$rootScope.SecondParm = undefined;
				}
				
				var reqData = {"User" : $rootScope.user.name,"PolicyKey": $rootScope.policyKey,"TypeActivity" : $routeParams.typeActivity, "EffectiveDate" : formatDate($rootScope.staticData.effectiveDate),"SecondParm" : secondParm};
					
				NavigationData.fetch(angular.toJson(reqData), function(data) {
					
					$rootScope.activityList = angular.fromJson(data.root.actions);
					$rootScope.screens = angular.fromJson(data.root.document.links);
					if($scope.screen){
						$scope.findUpdatedScreen($scope.screen, $rootScope.screens);
					}
					$rootScope.defaultActivities = angular.fromJson(data.root.document.defaultactions);
					$rootScope.screenActivities = angular.fromJson(data.root.document.actions);
					
				});
			};
			
			$scope.findUpdatedScreen = function(current, screens){
				
				for(var i =0 ; i< $scope.breadcrumbs.length; i++){
					angular.forEach(screens, function(value, key) {
					if(value.id == $scope.breadcrumbs[i].screenObj.id){
						screens = value.childLinks;
						if($scope.breadcrumbs[i].screenObj.id == current.id){
							$scope.screen = value;
							$scope.actions = value.actions;
							return;
						}
					}
				});
			}
		};
			
			$scope.beforeSave = function(){
				customBeforeSave($scope);
			};
			
			$scope.afterSave = function() {
				/*if($rootScope.defaultActionForGrids){
					$scope.displayDefaultPage($rootScope.defaultActionForGrids);
				}*/
				customAfterSave($scope);
				if($scope.typeactivity && $scope.typeactivity == "load"){
					$scope.typeactivity = undefined;
					return;
				}
				$scope.fetchNavigation(); 
				};
			
			//handler to update the breadcrumbs
				$scope.prepareBreadcrumbs = function(screen, BCInd, bc_label){									
					if (BCInd == 'pushBC'){
						
						BreadCrumbsService.push("home",
							    {
							        screenObj: angular.copy(screen),
							        label: bc_label
							    });
						
					}else{
						if (BCInd == 'updBC'){
							BreadCrumbsService.startFresh("home");
							BreadCrumbsService.pushUpdLast("home",
								    {
										screenObj: angular.copy(screen),
								        label: bc_label
								    });
							
						}
						
					}
					if ($scope.breadcrumbs.length <= 1){
						$scope.showPreviousButton = false;	
					}else{
						$scope.showPreviousButton = true;	
					}
				};
			//This method is called on the click of links in the navigation bar and is used to populate the metamodel for the Action menu.
			$scope.displayNavigationAction = function(screen, displayDefaultPage, BCInd) {
				var bc_label = screen.id;				
			
				$scope.prepareBreadcrumbs(screen, BCInd, bc_label);
			
				$scope.screen = screen;
				$scope.actions = screen.actions;
				
				if($rootScope.metadataKey) {
					$rootScope.metadataKey = undefined;
				}
		
				if(displayDefaultPage && $scope.actions != null) {
					if($scope.actions.type && $scope.actions.type == "popup"){
						$scope.$eval($scope.actions.action);
					}else{
						$scope.displayDefaultPage($scope.actions);
					}
				}
		
			};
			
					
			$scope.displayNavigationActionBC = function(screen, displayDefaultPage) {
			if (screen.actions){
				$scope.screen = screen;
				$scope.actions = screen.actions;
				
				if($rootScope.metadataKey) {
					$rootScope.metadataKey = undefined;
				}
		
				if(displayDefaultPage) {
					$scope.displayDefaultPage($scope.actions);
				}
			}else{
				$scope.displayPage(screen);
			}
		
			};
			
			$scope.displayDefaultPage = function(actions){
				$rootScope.defaultActionForGrids={};
				var displayDefaultAction = getDefaultAction(actions, "list");
				if(displayDefaultAction){
					$rootScope.defaultActionForGrids=actions;			
				}
				
				if(displayDefaultAction == null && ($routeParams.typeActivity == 'EN' || $routeParams.typeActivity == 'EC' || $routeParams.typeActivity == 'NB') ) {
					displayDefaultAction = getDefaultAction(actions, "change");
				} 
				
				if(displayDefaultAction == null) {
					displayDefaultAction = getDefaultAction(actions, "inquire");
				}
				
				if(displayDefaultAction == null) {
					displayDefaultAction = getDefaultAction(actions, "add");
				}
				if(displayDefaultAction){
					$scope.displayPage(displayDefaultAction);
				}
			};
			
			$scope.showMenubar = function(value) {
				showMenubar(value);
			};
			
			$scope.toggleSectionCollapse = function(value) {
				toggleSectionCollapse(value);
			};
			
			loadPage($routeParams, $rootScope, $scope);
			
			$scope.fetchNavigation(); 
			
		} else if($scope.screenType == "modal_screen") {
			
			$rootScope.openScreen = function(modalScope, screenId, linkelements, actionoverride) {
				
				$rootScope.linkelements = linkelements;
				$rootScope.actionoverride = actionoverride;
				if(!modalScope.modalScreenMetadata) {
					var action = { "id" : screenId, "name" : "ModalSearch" };
					modalScope.displayPage(action, undefined, function(metainfo) {
						modalScope.metadata = metainfo.metadata;
						modalScope.behavior = metainfo.behavior;
						
						if (!modalScope.$$phase) {
							modalScope.$apply();
				        }
						
						$rootScope.openModal('screen');
					});
				} else {
					modalScope.metadata = modalScope.modalScreenMetadata;
					$rootScope.openModal('screen');
				}
				
			};
			
			$rootScope.openSearchScreen = function(modalScope, screenId, gridId, linkelements, actionoverride) {
				
				GridData.fetch(modalScope, gridId, undefined, function(data){
					
					if(modalScope.gridData.length == 1){
						var firstRow =  data.rows[0];
						
						if(linkelements) {
							angular.forEach(linkelements, function(value, key) {
								if(value.start && value.end){
									$rootScope.data[key]= firstRow[value.field].substring(value.start,value.end);
								}else{
									$rootScope.data[key] = firstRow[value];
								}
							});
						};
					}
					
					$rootScope.openScreen(modalScope, screenId, linkelements, actionoverride);
				});
			};
		}
		
		
	});
	
}

function updatePayLoadKey($rootScope){
	$rootScope.policyKey = $rootScope.user.loc + $rootScope.user.mco + $rootScope.staticData.policyNumber;
}

function updatePayLoadModule($rootScope){
	$rootScope.policyNumber= padRight($rootScope.data.BC_KEY_SYMBOL, 3, " ") + $rootScope.data.BC_KEY_POLICY_NUMBER + $rootScope.data.BC_LATEST_POLICY_MODULE;
	$rootScope.policyKey = $rootScope.data.BC_KEY_LOCATION_COMPANY + $rootScope.data.BC_KEY_MASTER_COMPANY + $rootScope.policyNumber;
	$rootScope.staticData.policyNumber=$rootScope.policyNumber;
}

function visitElement(section, handler) {
	
	for(var i=0; i<section.length; i++) {

		var subsection = section[i].subsection;
		if(subsection) {
			for(var j=0; j<subsection.length; j++) {

				var element = subsection[j].element;
				for(var k=0; k<element.length; k++) {
					
					var elem= element[k];
					if(elem.controlgroup) {
						var ctrlGrp = elem.controlgroup;
						for(var l=0; l<ctrlGrp.length; l++) {
							handler(ctrlGrp[l]);
						}
					} else {
						handler(element[k]);
					}
				}
			}
		}
	}
}

function checkViewState(rootScope,action){
	var viewstate = rootScope.viewstate;
	if (viewstate) {
		for ( var dependentElement in viewstate) {
			rootScope.watchers.push( rootScope.$watch('data.'+dependentElement, function(newVal, oldVal) {
				dependentElement = this.exp.substring(5,this.exp.length);
				var dependingElements = viewstate[dependentElement];
				for ( var i = 0; i < dependingElements.length; i++) {
					applyViewStateRule(dependingElements[i].element, dependingElements[i].type, checkValue(dependingElements[i].value, newVal), dependingElements[i].elementValue,dependingElements[i].Class); 	
				}
			}, false));
		}
	}
}

function setDefaultValue(data, element, supportData){
	var rows = supportData.rows;
	var found = false;
	var value = data[element.name];
	if(rows){
		for(var i=0; i<rows.length; i++){
			if(value == $.trim(rows[i][supportData.payLoad.valueNode])){
				found = true;
				data[element.name] = rows[i][supportData.payLoad.valueNode];
				break;
			}
		}
		if(!found){
			data[element.name] = "";
		}
	}
	
}

function fetchSupportData($browser, $routeParams, $rootScope, $scope, SupportData, action){
	var suppList = [];
	var elements =[];
	
	var metadata = $scope.metadata;
	var section = metadata.section;
	
	function checkSupport(elem) {
		if(elem.support == "true") {
			suppList.push(elem.name);
		}else{
			elem.suppdata={"rows":elem.options, "payLoad":{"valueNode":"value","descriptionNode":"description"}};
		}
	}
	
	function applySupport(elem) {
		
		for(var ctr=0; ctr<elements.length; ctr++) {
			var elemsuppdata = elements[ctr];
			var name = elemsuppdata.payLoad.name;
			
			if(elem.name == name) {
				var valueNode = elemsuppdata.payLoad.valueNode;
				if(valueNode.indexOf("+") != -1){
					var values = valueNode.split("+");
					var rows = elemsuppdata.rows;
					for(var j =0; j<rows.length ; j++){
						var row = rows[j];
						var val = "";
						for(var i =0; i<values.length ; i++){
							val += row[values[i]];
						}
						row[values[0]] = val;
					}
					elemsuppdata.payLoad.valueNode = values[0];
				}
				
				if((elem.type == "select")|| (elem.type == "radio")) {
					elem.suppdata = elemsuppdata;
					setDefaultValue($scope.data, elem, elemsuppdata);
				} else {
					if(elemsuppdata.rows[0]) {
						$rootScope.data[name] = elemsuppdata.rows[0][elemsuppdata.payLoad.descriptionNode];
					}    
				}
				break;
			}
		}
	}
	
	setupPageValues($scope);
	
	visitElement(section, checkSupport);
	
	if (!$scope.$$phase) {
        $scope.$apply();
    }
	if(suppList[0]) {
		
		var key = $rootScope.data.KEY;
		
		if(!key) {
			key = buildFullKey($rootScope.data);
		}
		
		if(key && key[0]=="\""){
			key = key.substring(1, key.length-1);
		}
		
		$rootScope.data.KEY = key;
		if($routeParams.typeActivity == 'RB' && $rootScope.data.KEY.length <= 18){
			$rootScope.data.KEY = $rootScope.data.KEY +  padRight($rootScope.data.BC_LINE_OF_BUSINESS, 3, " ") + $rootScope.data.BC_POLICY_COMPANY + padLeft($rootScope.data.BC_AGENT_NUMBER, 7, "0") + $rootScope.data.BC_RISK_STATE + "            " + formatDate($rootScope.data.BC_POLICY_EFFECTIVE_DATE);
		}

		var supportInfo = angular.extend(angular.copy($rootScope.data), {
					"elements":suppList,
					"formId":metadata.formid,
					"formGroupId":metadata.groupid});
	
		SupportData.fetch(angular.toJson(supportInfo), function(suppdata) {
			
			if(suppdata) {
				
				elements = suppdata.elements;
				if(elements) {
					visitElement(section, applySupport);
				}
			}
			
			
			resetScreenData($rootScope, $browser,true);
			
			window_onload($scope,metadata,SupportData,"supportDataLoad", action, $routeParams);
		});
	} else {
		resetScreenData($rootScope, $browser,false);
	}
	
	window_onload($scope,metadata,SupportData, "metaDataLoad",action);
}