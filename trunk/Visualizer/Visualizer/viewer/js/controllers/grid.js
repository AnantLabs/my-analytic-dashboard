'use strict';

function GridCtrl($browser, $location, $rootScope, $scope, $routeParams, Data, MetaData, ViewState, SupportData, GridMetaData, GridData, NavigationData,$resource, URLService) {
	
	$scope.visible=false;

	$scope.gridName = $scope.field.gridId;
	
	GridMetaData.load($scope, $scope.field.gridId, function(gridMetaData) {
		$scope.gridMetaData = gridMetaData;
		
		if(gridMetaData.gridMetaData.rowAction){
			var gridAction = gridMetaData.gridMetaData.rowAction.options;
			var targetList="";
			if($routeParams.typeActivity == "IN"){
				targetList = [
			                  {"action":"inquire", "symbol":"IN"}];
			}else{
				targetList = [
				                  {"action":"inquire", "symbol":"IN"},
				                  {"action":"change", "symbol":"CH"},
				                  {"action":"delete", "symbol":"DL"},
				                  {"action":"add", "symbol":"ADD"},
				                  {"action":"change", "symbol":"ADD"} 
				                  ];
			}
			var actionList = [];
			for(var j = 0; j < targetList.length; j++){
					var status = $scope.isActionAllowed(gridAction, targetList[j].action);
					if(status){
						actionList.push(targetList[j]);	
					}
				}
			$rootScope.actionList = actionList;
		}
		
		if(gridMetaData.dataSource){
			if(gridMetaData.dataSource.type != "GRIDSPSEARCH") {
				GridData.fetch($scope, $scope.field.gridId, gridMetaData, function(data){
					grid_onload($scope, data, $routeParams);
				});
			}
			if(gridMetaData.dataSource.type != "GRIDSPSEARCH" && gridMetaData.dataSource.type != "GRIDSQLSEARCH") {
				$scope.visible=true;
			}
		}else{
			$scope.gridData=$rootScope.reportData;
		}
	});
	
	
	$rootScope.selectValue = function(rowItem) {
		if($rootScope.linkelements){
			angular.forEach($rootScope.linkelements, function(value, key) {
				if(value.field){
					var strVal = rowItem.entity[value.field];
					$rootScope.data[key] = strVal.substring(value.start, value.end);
				}else{
					var strVal = "";
					var flds = value.split("+");
					for(var i = 0; i < flds.length; i++){
						strVal += rowItem.entity[flds[i]] +" ";
					}
					$rootScope.data[key] = $.trim(strVal);
				}
	        });
		}else{
			angular.forEach(rowItem.entity, function(value, key){
	            if(key != "__ng_selected__"){
	           	 $rootScope.data[key] = value;
	            }
	        });
		}
		
		resetFlag($rootScope.modal);
		$rootScope.$apply();
		$browser.notifyWhenNoOutstandingRequests( function() { 
		validateFields();
	});
		
	};
	
	
	
	$rootScope.addGridDataRow = function(){
		if($scope.data.ClassSearch=="Y"){
			doWCVAuditClassCodeSearch();
		}else{
			$rootScope.data.KEY_EMP_CLASS_CODE = "";
			$rootScope.data.KEY_EMP_CLASS_DESCRIPTION_SEQ= "01";
			var rowObject = {};
			rowObject.DESCRIPTIONSEQ="01";
			rowObject.AUDPREM="0";
			$rootScope.data.KEY_EMP_CLASS_V_C_INDICATOR = 'N';
			var baseGridScope = "";
			if(angular.element('#'+'WcpAuditCovg').scope()){
				baseGridScope = angular.element('#'+'WcpAuditCovg').scope();
			}else{
				baseGridScope = angular.element('#'+'WcpAuditCovgPolicyLevelGrid').scope();
			}
			baseGridScope.gridData.push(rowObject);			
			baseGridScope.$apply();
		}
	};
	

	$rootScope.selectPolicy = function(rowItem) {

			populateStaticData($scope.field.gridId, $rootScope, $scope, rowItem.entity);
			
			$rootScope.staticData.IssueCode = rowItem.entity.BCISSUE0CODE;

			$rootScope.policyKey = rowItem.entity.BCLOCATION + rowItem.entity.BCMASTER0CO + $rootScope.staticData.policyNumber+ padRight(rowItem.entity.BCLINE0BUS, 3, " ") + rowItem.entity.BCCOMPANY0NO+padLeft(rowItem.entity.BCAGENCY, 7, "0")+ rowItem.entity.BCRISK0STATE+"            "+ rowItem.entity.BCEFFDT;

  			$rootScope.LOBPayLoad = {	BC_KEY_LOCATION_COMPANY : rowItem.entity.BCLOCATION, BC_KEY_MASTER_COMPANY : rowItem.entity.BCMASTER0CO,
  								BC_RISK_STATE : rowItem.entity.BCRISK0STATE, BC_LINE_OF_BUSINESS : rowItem.entity.BCLINE0BUS };
  			
  			var reqData = {"User" : $rootScope.user.name,"PolicyKey": $rootScope.policyKey,"TypeActivity" : 'IN', "EffectiveDate" : formatDate($rootScope.staticData.effectiveDate),"SecondParm" : "0"}; 

  			NavigationData.fetch(angular.toJson(reqData), function(data) {
  				
  				var inquireActivity = [{"key":$rootScope.policyKey.substring(0,16)+"IN"+ rowItem.entity.BCLINE0BUS, "name": "Inquire" }];
  				$rootScope.activityList = inquireActivity.concat(angular.fromJson(data.root.actions));
  				
  			});
  			
  			$rootScope.activityList= [ {name: "Loading..."} ];
  			showPopup(activitypopup, event);
  			
	};
	
	
	$rootScope.fetchGridData = function(gridId) {
		var gridScope = angular.element('#'+gridId).scope();
		//Reinitialize the paging options after every new search
		gridScope.pagingOptions.pageSize= 5;
		GridData.fetch(gridScope, gridId, gridScope.gridMetaData, function(data){
					grid_onload(gridScope, data, $routeParams);
				});
	};
	
	$scope.pagingOptions = {
	        pageSizes: [5, 10, 20, 'All'],
	        pageSize: 5,
	        currentPage: 1
	    };
	
	$scope.filterOptions = { filterText: '' };
	$scope.totalServerItems = 0;
	//var gridCsvOption = {customDataWatcher: false};
	
	$scope.$watch('pagingOptions', function (newVal, oldVal) {
       	$rootScope.setPagingData($scope);
    }, true);
    
    $scope.$watch('gridData', function (newVal, oldVal) {
    	$scope.visible=true;
    	//gridCsvOption.customDataWatcher = true;
       	$rootScope.setPagingData($scope);
    }, true);
    
    $scope.pagedData = [];
    $rootScope.data.selectedGridData=[];
    $scope.gridOptions = {
			data : 'pagedData',
			plugins:  [new ngGridCsvExportPlugin({}),new ngGridFlexibleHeightPlugin()],
			columnDefs : 'gridColumnDefs',
			headerRowHeight: 43,
			showFilter : false,
			enablePaging: true,
			showFooter : true,
			showColumnMenu : true,
			jqueryUIDraggable: true,
			enablePinning: true,
			showGroupPanel: false,
			multiSelect : false,
			footerRowHeight : 0,
			totalServerItems:'totalServerItems',
	        pagingOptions: $scope.pagingOptions,
			filterOptions: $scope.filterOptions,
			afterSelectionChange : function(rowItem) {
				if(rowItem.selected && $scope.gridFunction) {
					if($rootScope[$scope.gridFunction]) {
						$rootScope[$scope.gridFunction](this);
					} else {
						eval($scope.gridFunction)(this,$scope,URLService);
					}
				}
			}
	};
    
    
    
    $scope.editableGridOptions =  {
    	data : 'pagedData',
    	plugins:  [new ngGridCsvExportPlugin({}),new ngGridFlexibleHeightPlugin()],
    	columnDefs : 'gridColumnDefs',
		enableCellSelection: false,
	    enableRowSelection: false,
    	headerRowHeight: 43,
	    enableCellEdit: false,
	    showFilter : false,
		enablePaging: true,
		showFooter : true,
		showColumnMenu : true,
		jqueryUIDraggable: true,
		enablePinning: true,
		showGroupPanel: false,
		multiSelect : false,
		footerRowHeight : 0,
		totalServerItems:'totalServerItems',
        pagingOptions: $scope.pagingOptions,
		filterOptions: $scope.filterOptions
    };
    
   
    $scope.selectableGridOptions = {
    	data : 'pagedData',
    	plugins:  [new ngGridCsvExportPlugin({}),new ngGridFlexibleHeightPlugin()],
    	columnDefs : 'gridColumnDefs',
    	displaySelectionCheckbox : true,
		multiSelect : true,
		showSelectionCheckbox: true,
		enableSorting: true,
		showFilter : false,
		enablePaging: true,
		showFooter : true,
		showColumnMenu : true,
		jqueryUIDraggable: true,
		enablePinning: true,
		showGroupPanel: false,
		footerRowHeight : 0,
		totalServerItems:'totalServerItems',
        pagingOptions: $scope.pagingOptions,
		filterOptions: $scope.filterOptions,
		selectedItems:  $rootScope.data.selectedGridData
    };
    
    $scope.editAndSelectGridOptions = {
        	enableCellSelection: false,
    		enableRowSelection: true,
    		enableCellEdit: true,
        	showSelectionCheckbox: true,
        	data : 'pagedData',
        	plugins:  [new ngGridCsvExportPlugin({}),new ngGridFlexibleHeightPlugin()],
        	columnDefs : 'gridColumnDefs',
        	headerRowHeight: 43,
        	multiSelect : true,
        	showFilter : false,
			enablePaging: true,
			showFooter : true,
			showColumnMenu : true,
			jqueryUIDraggable: true,
			enablePinning: true,
			showGroupPanel: false,
			footerRowHeight : 0,
			totalServerItems:'totalServerItems',
	        pagingOptions: $scope.pagingOptions,
			filterOptions: $scope.filterOptions,
        	selectedItems: $rootScope.data.selectedGridData
        };
    
	$scope.selectAction = function(rowItem, select) {
		$scope.$root.$$childTail.showPreviousButton = true;
		var rowAction = $scope.gridMetaData.gridMetaData.rowAction;
		var gridConfig = $scope.gridConfig;
		var action = {
			payLoad : {}
		};

		for ( var j = 0; j < rowAction.options.length; j++) {

			if (rowAction.options[j].value == select) {

				if (rowAction.options[j].id) {
					action.id = rowAction.options[j].id;
					action.payLoad.target = rowAction.options[j].target;
					if(gridConfig[action.id] && gridConfig[action.id].LinkElements){
						angular.forEach(gridConfig[action.id].LinkElements, function(value, key) {
							if(rowItem.entity[value]){
								action.payLoad[key] = rowItem.entity[value];
								//need to create a new rowaction template for WcpPriorCarrierHistoryGrid to remove hard coding
								$rootScope.data[key] = rowItem.entity[value];
								$rootScope.data.REQUESTCODE = rowAction.options[j].reqcode;
							}else{
								action.payLoad[key] = $scope.data[value];
							}
				        });
					}else{
						angular.forEach(rowItem.entity, function(value, key){
				            if(key != "__ng_selected__"){
				           	 $rootScope.data[key] = value;
				            }
				        });
					}
				} else {
					action.metadataKey = buildKey($rootScope, rowAction.keyParams, rowItem, rowAction.options[j]);
				}

				action.name = rowAction.options[j].description;
				action.payLoad.REQUESTCODE = rowAction.options[j].reqcode;
				if(rowAction.options[j].keyParams){
					action.payLoad.KEY = buildKey($rootScope, rowAction.options[j].keyParams, rowItem, rowAction.options[j]);
				}else{
					action.payLoad.KEY = $rootScope.data.KEY;
				}
				action.payLoad.User=$scope.user.name;
				
				break;
			}
		}

		resetFlag($rootScope.modal);
	};
	
	
	
	$scope.changeAuditAction = function(rowItem, select) {
		$scope.$root.data.AUDEFFDATE = rowItem.entity.AUDITEFFDATE;
		$scope.$root.data.AUDEXPDATE = rowItem.entity.AUDITEXPDATE;
		$scope.selectedRow = rowItem;
		$("#AddAuditPeriod").css("display", "none");
		$("#UpdateAuditPeriod").css("display", "block");
	};
	
	$scope.deleteAuditAction = function(rowItem, select) {
		$scope.gridData.splice(rowItem.rowIndex,1);
	};
	
	$scope.isActionAllowed = function(actions,value){
		for(var i = 0; i < actions.length; i++){
			if(actions[i].description.toLowerCase() == value){
				return true;
			}
		}
	};
	
	$rootScope.setPagingData = function(gridScope){
		
		var pageSize = gridScope.pagingOptions.pageSize;

		if(pageSize == 'All'){
			$scope.pagedData = angular.copy($scope.gridData);
		} else {
		
		var data = gridScope.gridData; 
		var page = gridScope.pagingOptions.currentPage;
		
		var showPaging = data.length/pageSize > 1 ? true : false;
		if(showPaging){
			$('.ngFooterPanel').parent().show();
			$('.ngFooterPanel').parent().height(55);
			$(".ngPagerButton").attr("type","button");
		} else{
			$('.ngFooterPanel').parent().hide();
			$('.ngFooterPanel').parent().height(0);
		}
		
		gridScope.pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		gridScope.totalServerItems = data.length;
		if(Math.ceil(data.length/pageSize)<page){
			gridScope.pagingOptions.currentPage=1;
		}
		
		}
        
		if (!gridScope.$$phase) {
			gridScope.$apply();
        }
    };

    $rootScope.callTemplateFunction=function(function_name,data) {
    	if(function_name){
    		var returnData= eval(function_name)(data, $rootScope);
    		if(event != undefined && event != null){
    			try {
    				event.stopPropagation();
    			}
    			catch(err) {
    			    
    			}    			
    		}
    		return returnData;
    	}
	};
	
	$rootScope.callGridAction=function(function_name,data) {
    	if(function_name){
    		eval(function_name)(data, $rootScope);
    		if(event != undefined && event != null){
    			try {
    				event.stopPropagation();
    			}
    			catch(err) {
    			    
    			}    			
    		}
    		resetFlag($rootScope.modal);
    		
    		$('#gridactions').removeClass('active');
    	}
	};
	
}