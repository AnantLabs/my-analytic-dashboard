'use strict';

/* Directives */

//Directive for formating(Zero fill and Upper Case) the Text of the input control 
app.directive('mvcAutoFormat', function() {
	return {
		restrict : 'A',
		
		require: '?ngModel',
		
		link : function(scope, elem, attrs, ngModel) {
			
			if(!ngModel) return;
			
			 elem.bind('blur change', function() {
				if(elem.attr("mvc-auto-format")=="true") {
					
					var regexp = elem.attr('mvc-regexp');
					if(elem.val()){
						if (regexp.indexOf("0-9") >= 0) {
							elem.val(padLeft(elem.val(), elem.attr("maxlength"), "0"));
						}else {
							elem.val(elem.val().toUpperCase());
						}
					}
				}else if(elem.attr("mvc-auto-format")=="decimal"){
					var decimalLength = elem.attr("decimal-len");
					if(decimalLength == undefined || decimalLength== null){decimalLength = 2;}
					var value = elem.val();
					var splitValue = value.split('.');
					value=splitValue[0];
					if(splitValue.length>1){
						splitValue[1] = padRight(splitValue[1],decimalLength,'0');
						value = value + '.' + splitValue[1];
					}
					elem.val(value);
				}
				ngModel.$setViewValue(elem.val()); 
				ngModel.$modelValue = elem.val();
				scope.$apply();
			});
			elem.bind('keyup', function() {
				if(elem.attr("mvc-auto-format")=="decimal"){
					var maxLength = elem.attr("maxlength");
					var decimalLength = elem.attr("decimal-len");
					if(decimalLength == undefined || decimalLength== null){decimalLength = 2;}
					var intLength = maxLength - decimalLength - 1;
					var value = elem.val();
					var splitValue = value.split('.');
					value = splitValue[0];
					if(splitValue[0].length> intLength){
						splitValue[0]  = splitValue[0].slice(0,intLength);
						value = splitValue[0];
						if(splitValue.length>1){
							value = splitValue[0] + '.' + splitValue[1] ;
						}
						elem.val(value);
					}
					if(splitValue.length>1){
						value = value + '.' + splitValue[1];
						if(splitValue[1].length > decimalLength)
						{
							splitValue[1] = splitValue[1].slice(0,decimalLength);
							value = splitValue[0] + '.' + splitValue[1];
							elem.val(value);
						}
					}
				}
				ngModel.$setViewValue(elem.val()); 
				ngModel.$modelValue = elem.val();
				scope.$apply();
			});
		}
	};
});


app.directive('mvcDatePicker', function($timeout) {

	return {

		require : '?ngModel',

		link : function(scope, element, attrs, ngModel) {
			
			var format = attrs.dateformat;
			var formatTo = "yyyy-mm-dd";

			if (!IsInputTypeSupported('date')) { // Non-HTML5
				
				$timeout( function(){
					$(element).datepicker('destroy');
		            $(element).datepicker();
		            if (element.val()!="" && element.val()!="0" && element.val() !="00/00/00")
		            element.val(formatDate(element.val(), "mm/dd/yyyy"));
		        });
								
				element.on("keyup",function(){
					if(element.val().length <= 2 || (element.val().length > 3 && element.val().length <= 5)){
						if(element.val().substr(element.val().length - 1) == "/"){
							element.val(element.val().substr(0 , element.val().length - 1));
						}
					}
					if(element.val().length ==2 || element.val().length ==5){
						if(element.val().substr(0,2) > 12){
							element.val("");
						}
						else if(element.val().substr(3,5) > 31){
							element.val(element.val().substr(0,3));
						}
						else{
							element.val(element.val() + "/");
						}
					}
					if(element.val().length ==11){
						element.val(element.val().substr(0, element.val().length - 1));
					}
					
				});

			}

			ngModel.$parsers.push(function(value) {
				if (IsInputTypeSupported('date')) {
				var date = formatDate(value, format);
				return date;
				}else{
					if (value!="0"){
					var date = formatDate(value, format);
					return date;
					}else{
					  return ''; 
					}
				}
			});

			ngModel.$formatters.push(function(value) {
				if (IsInputTypeSupported('date')) { 
				   if(value=="0"){
					  ngModel.$modelValue = "";
				}
				var date = formatDate(value, formatTo);
				return date;
				}else{
					   if(value=="0" || value=="00/00/00"){
							  ngModel.$modelValue = "";
						}else{
							var date = formatDate(value, formatTo);	
						}
						
						return date;	
					
				}
			});

		}
	};
});


app.directive('mvcCurrency', function($filter) {

	return {

		require : '?ngModel',

		link : function(scope, element, attrs, ngModel) {
			
			ngModel.$parsers.push(function(value) {
				if(value) {
					var startIdx = 0;
					if(value.charAt(0) == attrs.mvcCurrency) {
						startIdx = 1;
					}
					return value.substring(startIdx, value.length).replace(/,/g,'');
				}
			});

			ngModel.$formatters.push(function(value) {
				if(value){
					return $filter('currency')(value.replace(/,/g,''), attrs['mvc-currency'] );
				}
			});
			
		}
	};
});


app.directive('mvcValidate', function($rootScope) {
	return {
		restrict : 'A',

		link : function(scope, elem, attrs) {

			elem.on('submit', function(evt) {
				
				var form = evt.target;
				var baseURL = $rootScope.appConfig.BaseURL;
								
				var isValid = 	validateForm(form, scope.bypassValidate)  && //
				validateRules(form, baseURL) && //
				validateCustomRules(scope);

				if (isValid) {
					// Do nothing and return
					return;
				} 
				
				// Otherwise stop event propagation
				evt.stopImmediatePropagation();
				evt.preventDefault();
				
			});

			elem.on('change', function(evt) {
				var field = evt.target;
				validateField(field);
			});
			
		}
	};
});

app.directive('mvcHideerror', function() {
	return {
		restrict : 'A',

		link : function(scope, elem, attrs) {

			elem.on('click', function(evt) {
				hideMessage();
				hideWidgets();
			});

		}
	};
});

app.directive('mvcreset', function($rootScope) {
	return {
		restrict : 'A',
		
		link : function(scope, elem, attrs) {

			elem.on('click', function(){
				reset($rootScope);
			});
		}
	};
});
//directive to toggle classes

app.directive('mvcToggleClass', function() {
	return {
		restrict : 'A',

		link : function(scope, elem, attrs) {

			elem.on('click', function(evt) {
				toggleClasses(this);
			});
		}
	};
});  

app.directive('mvcHideSection', function($document) {
	  return function(scope, element, attr) {
		  if(angular.element($(element)).scope().subsections.subsectiontitle == "hiddenfields")
			  {
			  	$(element).removeClass("subsectiondiv");
			  	$(element).find("i").remove();
			  }
	  };
});

function reset($rootScope){
	$rootScope.data= angular.copy($rootScope.origData);
	$rootScope.$apply();
}

app.directive('mvcNumber', function($filter) {

	  return {
	       restrict: 'A',
	       require : 'ngModel',
	       
	       link: function(scope, elem, attrs, ngModel){

			if(!ngModel) return;
			
			if(attrs.maxlength){
				buildMax(elem,attrs);
			}
			
			if(attrs.decimal){
				buildDecimal(elem, attrs);

				elem.bind('keyup', function() {
					var value = elem.val();
					var maxvalue = elem.attr('max');
					if(value >= Number(maxvalue) - 1){
						var val = value.split('.');
						val[0] = val[0].slice(0,maxvalue.length);
						if(val[1]!=undefined){
							value = val[0] + '.' + val[1]; 
						}else{
							value = val[0];
						}
						elem.val(value);
					}
				});
				elem.bind('blur change', function() {
					var value = elem.val();
					if(value!="" && attrs.decimal){
						value = (parseFloat(value)).toFixed(attrs.decimal);
					}
					elem.val(value);
					ngModel.$setViewValue(elem.val()); 
					ngModel.$modelValue = elem.val();
				});
				
			}else{
				elem.bind('keyup change',function(){
					var value = elem.val();
					var maxLength = elem.attr('maxlength');
					if(value.length > maxLength){
						value = value.slice(0,maxLength);
						elem.val(value);
					}
					var indexOfDecimal = value.indexOf('.');
					if(indexOfDecimal > -1){
						value = value.slice(0,indexOfDecimal);
						elem.val(value);
					}
					ngModel.$setViewValue(elem.val()); 
					ngModel.$modelValue = elem.val();
				});
			}
			
			if(attrs.maxlength < 18){
				elem.attr("type","number");
			}
			
			ngModel.$formatters.push(function(value) {
				if(attrs.decimal!=undefined && attrs.decimal!=""){
					value = (parseFloat(value)).toFixed(attrs.decimal);
					buildDecimal(elem,attrs); 
				}
				return value;
			});
			
			function buildDecimal (elem, attrs) {
											
				var decimalPoints=0;
				var step="0.";
				var decimal = attrs.decimal;
				
				while(decimalPoints++ < decimal-1) {
					step = step+"0";
			 	}
				step = step+"1";
				elem.attr("step",step);
			}
			
			function buildMax(elem, attrs){
				
				var maxlength = attrs.maxlength;
				var decimal = attrs.decimal;
				var length = maxlength;
				if(decimal.trim()!=""){
					length=maxlength-decimal-1;
				}
				var max="";
				
				while((length--)>0) {
					max=max+"9";
				}
				
				elem.attr("min","0");
				elem.attr("max",max);
				
			}
		}
	};
});

app.directive('mvcBreadcrumbs', function(BreadCrumbsService) {	 
    return {
        restrict: 'A',
        templateUrl: 'mvc/partials/mvcbreadcrumb.html',
        replace: true,
        compile: function(tElement, tAttrs) {
            return function($scope, $elem, $attr) {
                var bc_id = $attr['id'],
                    resetCrumbs = function() {
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
                    	if ($scope.breadcrumbs.length <= 1){
    						$scope.showPreviousButton = false;	
    					}else{
    						$scope.showPreviousButton = true;	
    					}
                    };
                resetCrumbs();
                $scope.separator = ' >> ';
                $scope.unregisterBreadCrumb = function( index ) {
                    BreadCrumbsService.setLastIndex( bc_id, index );
                    resetCrumbs();
                };                
                $scope.$on( 'mvcBCRefresh', function() {                    
                    resetCrumbs();
                } );
            };
        }
    };

});

app.directive('mvcPresubmit', function($rootScope) {
	return {
		restrict : 'A',

		link : function(scope, elem, attrs) {

			elem.on('click', function(evt) {
					angular.element('#submit').scope().eventId=evt.target.id;				
			});
		}
	};
});

app.directive('mvcEmbed', function($rootScope) {
	return {
		restrict : 'A',

		link : function(scope, elem, attrs) {
			
			var url = eval(attrs.mvcEmbed)(scope);
			elem.append($('<embed src="' + url +'" class="span12"></embed>'));
			
		}
	};
});