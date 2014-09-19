
app.factory("Data", function($resource, $rootScope, $location) {

	this.save = function(payLoad, onSuccess ) {
		payLoad.User=$rootScope.user.name;
		
		
		var url = $rootScope.appConfig.BaseURL + '/data';
		
		$resource(url).save(payLoad, function(payLoad) {
			
			if(payLoad.rows){
				$rootScope.reportData=payLoad.rows;
			}
				
			if(payLoad.RESPONSE_MESSAGE) {
				showMessage(payLoad.RESPONSE_MESSAGE, 10);
			}
			
			var errorMessage ="";
			var errorSeverity="";

			if (errorMessage != undefined && errorSeverity != "") {
				if(errorSeverity == undefined){
					errorSeverity='';
				}
				showMessage(errorMessage, errorSeverity);
				$rootScope.data.ERROR1='';
				$rootScope.data.ERRORSEV1='';
				if(errorSeverity == 30) {
					return;
				}
			}
			
			$rootScope.data = payLoad;
			
			if(onSuccess) {
				onSuccess(payLoad);
			}
		});
	};
	
	return this;
});

app.factory("SupportData", function($resource, $rootScope) {
	
	this.fetch = function(payLoad, onSuccess) {

		$resource($rootScope.appConfig.BaseURL + '/data/support').save(payLoad, function(data) {
			if(onSuccess) {
				onSuccess(data);
			}
		});
	};
	
	return this;
});

app.factory("MetaData", function($resource, $rootScope, SupportData, $location, $browser, ViewState) {
		
	this.load  = function($scope, action, onSuccess) {
		
		var metadataPayload = { "screenId" : action.id, "key" : action.metadataKey }; 
		
		if($rootScope.watchers){
			while($rootScope.watchers.length>0){
				$rootScope.watchers.pop()();
			}
		}

		$resource($rootScope.appConfig.BaseURL + "/metadata").save(metadataPayload,function(m) {
			
			$scope.currentScreenId = m.screenId;
			
			if(onSuccess) {
				onSuccess(m);
			}
			
		});
	};
	
	return this;
});


app.factory("GridMetaData", function($resource, $rootScope) {

	this.load = function($scope, gridId, onSuccess) {
		
		$scope.gridData = [];
		
		$resource($rootScope.appConfig.BaseURL + "/metadata/grid/" + gridId).get(function(gridMetaData) {
			
			$scope.gridMetaData = gridMetaData;
			
			$scope.gridColumnDefs = gridMetaData.gridMetaData.element;
			$scope.gridTitle = gridMetaData.gridMetaData.title;
			
			if($rootScope.actionoverride){
				$scope.gridFunction = $rootScope.actionoverride;
				$rootScope.actionoverride = undefined;
			}else{
				$scope.gridFunction = gridMetaData.gridMetaData.operation.jsfunction;
			}
			
			if(gridMetaData.gridMetaData.gridType){
				$scope.gridType = gridMetaData.gridMetaData.gridType;
			}

			if(onSuccess) {
				onSuccess(gridMetaData);
			}
		});
	};

	return this;
});

app.factory("GridData", function($resource, $rootScope) {
	
	$rootScope.gridData = [];

	this.fetch = function($scope, gridId, gridMetaData, onSuccess) {
		
		var gridpayload = {};
		
		updateGridDataPayload($scope, gridId, gridpayload);
		
		if($rootScope.actionPayLoad){
			gridpayload = $rootScope.actionPayLoad;
		}
		
		if($rootScope.data.KEY && !gridpayload.KEY){
			gridpayload.KEY = $rootScope.data.KEY;
		}
		
		if(gridMetaData && gridMetaData.dataSource.params) {
			
			angular.forEach(gridMetaData.dataSource.params, function(paramValue, paramName) {
				
				if(paramValue) {
					angular.forEach(paramValue, function(param) {
						if(!param.type){
							if(!gridpayload[param.name]){
								gridpayload[param.name]= $rootScope.data[param.name];
							}
						} else {
							var value = $rootScope.data[paramName];
							if(value) {
								gridpayload[paramName]= value;
							}
						}
					});
				}
			});
			gridpayload.maxKeySize = gridMetaData.dataSource.maxKeySize;
		}else {
			gridpayload = angular.copy($rootScope.data);
			if(gridpayload.KEY && gridpayload.KEY[0]=="\""){
				gridpayload.KEY= gridpayload.KEY.substring(1, gridpayload.KEY.length-1);
			}
		}
		gridpayload.MAXRECORDS="030";
		gridpayload.WILDCARD="ON";
		
		$resource($rootScope.appConfig.BaseURL + "/data/grid/"+gridId).save(gridpayload, function(data) {
			$scope.gridData = data.rows;
			if($scope.gridMetaData && $scope.gridMetaData.gridMetaData.gridType=="editableGrid"){
				$scope.data.selectedData = $scope.gridData;	
			}
			if(onSuccess) {
				onSuccess(data);
			}
		});
  	};

	return this;
});

app.factory("NavigationData", function($rootScope, $resource, $location) {
	
	this.fetch = function(data, onSuccess) {
		
		$resource($rootScope.appConfig.BaseURL + '/data/navigation').save(data, function(data) {
	    	if(onSuccess) {
	    		onSuccess(data);	
	    	}
	    });
	};
	
	return this;
});


app.factory("Personalization", function($resource, $rootScope) {

	function fetchAppnames(list){
		var appsAdded='';
		$(list).each( function(){
			if(this.appadded=='yes'){
				appsAdded=appsAdded+this.appid+',';
			}
		});
		return appsAdded;
	}
	this.savePersonalizationData = function(personalPayLoad) {
		
		$resource($rootScope.appConfig.BaseURL + "/personalization/"+$rootScope.user.name).save(personalPayLoad, function(data) {
			if(data.Message){
				$rootScope.closeModal('personalize');
				showMessage(data.Message, data.severity);
			}
		});
	};
	
	this.saveHomePersonalisationData = function(valueName,homeScreenData) {
			
			
			var value='';
			if(valueName=="appsAdded"){
				value = fetchAppnames(homeScreenData);	
			}
			else {
				value = $rootScope.favExpressOptions;
			}
			
			//var personalPayLoad = "{ \"payLoad\" : { \"" + valueName + "\" : \"" + value + "\"}}";
			var personalPayLoad= angular.fromJson("{ \"" + valueName + "\" : \"" + value + "\"}");
			$resource($rootScope.appConfig.BaseURL + "/personalization/home/"+$rootScope.user.name).save(personalPayLoad, function(data) {
				if(data.Message){
					showMessage(data.Message, data.severity);
				}
			});
		};
	
	return this;
});

app.factory("ViewState",function($resource, $rootScope) {

	this.getRules = function(screenId, onSuccess) {

//		$resource($rootScope.appConfig.BaseURL + "/rules/viewstate/"+ screenId).get(function(data) {
//			if (onSuccess) {
//				onSuccess(data);
//			}
//		});
		
		$.ajax({
				async : false,
				url : $rootScope.appConfig.BaseURL +"/rules/viewstate/" +  screenId,
				type : "GET",
				success : onSuccess
			});
		
	};
	return this;
});

function checkValue(expectedValue, actualValue) {

	if (expectedValue[0] == '!') {
		expectedValue = expectedValue.substr(1, expectedValue.length);
		return actualValue != expectedValue;
	} 
	else {
		return actualValue == expectedValue;
	}
}

function applyViewStateRule(elementName, actionType, actionValue,elementValue,Class) {

	var ename = elementName;
	elementName = "#"+elementName;
	
	if ($(elementName) ){
		switch (actionType) {
			case "RO": {
				if (actionValue) {
					$(elementName).attr("disabled", "disabled");
				} else {
					$(elementName).removeAttr("disabled"); 
				}
				break;
			}
		
			case "CV": {
				if(actionValue){
					//$(elementName).val(elementValue);
					$(elementName).scope().data[elementName.substring(1)] = elementValue;  
					break;
				}
			} 
			
			case "CC": {
				if (actionValue) {
					if($('#ID_GROUP_'+ename).length != 0){
						$('#ID_GROUP_'+ename).removeClass(Class);
					}else if($('#'+ename).length != 0){
						$('#'+ename).removeClass(Class);
					}
					
				} else {
					if($('#ID_GROUP_'+ename).length != 0){
						$('#ID_GROUP_'+ename).addClass(Class);
					}else if($('#'+ename).length != 0){
						$('#'+ename).addClass(Class);
					}
					
				}
				break;
				
			} 
			
			case "V":
			default: { //this default not working for self dependent case as that field is hidden not available in form.
				
				if (actionValue) {
					if($('#ID_GROUP_'+ename).length != 0){
						$('#ID_GROUP_'+ename).hide();
					}else if($('#ID_'+ename).length != 0){
						$('#ID_'+ename).hide();
					}
					//$(elementName).css('display','none'); //hide
				} else {
					if($('#ID_GROUP_'+ename).length != 0){
						$('#ID_GROUP_'+ename).show();
					}else if($('#ID_'+ename).length != 0){
						$('#ID_'+ename).show();
					}
					//$(elementName).css('display','inline');
				}
				
				break;
			}
		} // switch
	} // if
}

app.factory('BreadCrumbsService', function($rootScope, $location,$routeParams) {
    var data = {};
    var pushOnce = false;
    $rootScope.lenBC = 0;
    var ensureIdIsRegistered = function(id) {
        if (angular.isUndefined(data[id])) {
            data[id] = [];
        }
    };
    return {
        push: function(id, item) {
        	$(".breadcrumb").css("display","inline");
            ensureIdIsRegistered(id);
            data[id].push(item);            
            $rootScope.$broadcast( 'mvcBCRefresh' );
        },
        pushUpdLast: function(id, item) {
        	$(".breadcrumb").css("display","inline");
        	ensureIdIsRegistered(id);        	
        	if (pushOnce){
        		if ($rootScope.lenBC > data[id].length){
        			data[id].push(item);
            		$rootScope.lenBC = data[id].length;
        		}else{
        		 data[id][data[id].length-1].screenObj = item.screenObj;
                 data[id][data[id].length-1].label = item.label;
        		}
        	}else{
        		pushOnce = true;
        		data[id].push(item);
        		$rootScope.lenBC = data[id].length; 
        	}
            $rootScope.$broadcast( 'mvcBCRefresh' );
        },
        startFresh: function(id){
        	data[id] = [];
        },
        get: function(id) {
            ensureIdIsRegistered(id);
            return angular.copy(data[id]);
        },
        setLastIndex: function( id, idx ) {
            ensureIdIsRegistered(id);
            if ( data[id].length > 1+idx ) {
                data[id].splice( 1+idx, data[id].length - idx );
            }
        }
    };
});

app.factory("Reports", function($resource, $rootScope) {
	
	this.getReportSupportData = function(subsystemName, onSuccess) {

		$resource($rootScope.appConfig.BaseURL + "/data/support/report/"+ subsystemName).save(function(data) {
			if(onSuccess) {
				onSuccess(data);
			}
		});
	};
	
	this.getReportData = function(payload, onSuccess) {

		$resource($rootScope.appConfig.BaseURL + '/data/report').save(payload, function(data) {
			if(onSuccess) {
				onSuccess(data);
			}
		});
	};
	
	this.getReportMetaData = function(payload, onSuccess) {

		$resource($rootScope.appConfig.BaseURL + '/metadata/report').save(payload, function(data) {
			if(onSuccess) {
				onSuccess(data);
			}
		});
	};
	return this;
});

