
var ValidationRules = {};

function validateRules(form, baseURL) {

	// Fetch validation rules
	if (!ValidationRules[form.id]) {
		$.ajax({
			async : false,
			url : baseURL +"/rules/validation/" + form.id,
			type : "GET",
			success : function(rules) {
				if(rules){
					ValidationRules[form.id] = angular.fromJson(rules);
				}
			}
		});
	}
	
	var validationRule = ValidationRules[form.id];
	var errMsg = [];
	if (validationRule) {
			
		var formFieldArray = [];
		
		
		// validate
		var data = form;
		for(var valInd = 0 ; valInd < validationRule.validations.length; valInd ++){
			
			var validation = validationRule.validations[valInd];
			var validationOperation = validation.operation;
		
			var errorMessage = validation.error;
			var swtch = false;
		
			if (validationOperation == 'and') { 
				// all the list of fields in validation JSON should be non empty.
		
				for ( var i = 0; i < validation.fields.length; i++) {
		
					formFieldArray[i] = data[validation.fields[i]].value;
		
				}
		
				for ( var k = 0; k < formFieldArray.length; k++) {
					if (formFieldArray[k] == "") {
						swtch = true;
					}
				}
		
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			} else if (validationOperation == 'or') { 
				// Atleast one of the field from the list in validation JSON should be non empty.
				
				for ( var i = 0; i < validation.fields.length; i++) {
		
					formFieldArray[i] = data[validation.fields[i]].value;
		
				}
		
				var totalFields = formFieldArray.length;
				var count = 0;
		
				for ( var k = 0; k < formFieldArray.length; k++) {
					if (formFieldArray[k] == "") {
						count++;
		
					}
		
				}
				if (totalFields == count) {
					swtch = true;
				}
		
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			} else if (validationOperation == 'xor') {
				// If atleast one of the field in first set is non empty, then all the fields of second set must be empty
		
				count = 0;
				var firstGroupFieldArray = [];
				var secondGroupFieldArray = [];
		
				for ( var i = 0; i < validation.fields[0].length; i++) {
					firstGroupFieldArray[i] = data[validation.fields[0][i]].value;
		
				}
		
				for ( var j = 0; j < validation.fields[1].length; j++) {
					secondGroupFieldArray[j] = data[validation.fields[1][j]].value;
		
				}
		
				for ( var x = 0; x < firstGroupFieldArray.length; x++) {
		
					if (firstGroupFieldArray[x] == "") {
						count++;
					}
		
				}
				if (count == (firstGroupFieldArray.length)) {
					
				} else {
		
					for ( var y = 0; y < secondGroupFieldArray.length; y++) {
		
						if (!secondGroupFieldArray[y] == "") {
							swtch = true;
						}
		
					}
				}
		
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			} else if (validationOperation == 'xor-e') {
				// if all the fields of first set are non empty, then all the fields of second set must be empty
		
				count = 0;
				var firstGroupFieldArray = [];
				var secondGroupFieldArray = [];
		
				for ( var i = 0; i < validation.fields[0].length; i++) {
					firstGroupFieldArray[i] = data[validation.fields[0][i]].value;
		
				}
		
				for ( var j = 0; j < validation.fields[1].length; j++) {
					secondGroupFieldArray[j] = data[validation.fields[1][j]].value;
		
				}
		
				for ( var x = 0; x < firstGroupFieldArray.length; x++) {
		
					if (firstGroupFieldArray[x] == "") {
						
					} else {
						count++;
					}
		
				}
				if (count == (firstGroupFieldArray.length)) {
		
					for ( var y = 0; y < secondGroupFieldArray.length; y++) {
		
						if (!secondGroupFieldArray[y] == "") {
							swtch = true;
						}
		
					}
				}else{
					break;
				}
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			} else if (validationOperation == 'mc') {
				// if field of first set is non empty, field of second set must be non empty.
				
				for ( var i = 0; i < validation.fields.length; i++) {
		
					formFieldArray[i] = data[validation.fields[i]].value;
		
				}
				count = 0;
				var firstGroupFieldArray = [];
				var secondGroupFieldArray = [];
				firstGroupFieldArray = validation.fields[0];
				secondGroupFieldArray = validation.fields[1];
				for ( var x = 0; x < firstGroupFieldArray.length; x++) {
					var firstGroupFieldValue = data[firstGroupFieldArray[x]].value;
					if (firstGroupFieldValue == "") {
						
					} else {
						count++;
					}
		
				}
				if (count == (firstGroupFieldArray.length)) {
					for ( var y = 0; y < secondGroupFieldArray.length; y++) {
						var secondGroupFieldValue = data[secondGroupFieldArray[y]].value;
						if (secondGroupFieldValue == "") {
							swtch = true;
						}
		
					}
				}else{
					break;
				}
				if (swtch) {
					errMsg.push(errorMessage);
					break;
				}
		
			}// end mc
		}//end of for loop
	}
	
	if (errMsg[0]) {
		showMessage(errMsg[0], "20");
		return false;
	}
	
	return true;
}

function showMessage(message, severity) {

	var errorPopup = $("#errorPopup");
	var errorIcon = $("#errorIcon");
	
	errorPopup.removeClass("alert-error");
	errorPopup.removeClass("alert-warning");
	errorPopup.removeClass("alert-info");

	errorIcon.removeClass("icon-remove-sign");
	errorIcon.removeClass("icon-warning-sign");
	errorIcon.removeClass("icon-info-sign");
	
	if(severity =="30") {
		errorPopup.addClass( "alert-error" ); 
		errorIcon.addClass( "icon-remove-sign" );
	} else if(severity =="20") {
		errorPopup.addClass( "alert-warning" ); 
		errorIcon.addClass( "icon-warning-sign" );
	} else {
		errorPopup.addClass( "alert-info" ); 
		errorIcon.addClass( "icon-info-sign" );
	}
	
	$("#errorMessage").html( message );
	$("#errorPopup").show();
}

function hideMessage() {
	$("#errorPopup").hide();
}

function validateRequiredField(field) {

	var valid = true;

	field = $(field);
	if (field.attr('mvc-required') == "required" && field.is(":visible") && !field.is(':disabled')) {
		if(((field.attr("type") == 'number')) && (field.val()=='0')){
			valid= false;
		}else if(((field.attr("type") == 'text')) && (field.attr("maxlength") > 17) && (field.val()=='0')){
			valid= false;
		} else {
			valid = field.val().trim().length > 0 && field.val().indexOf("?")<0 ;
			}  
		if (valid) {
			field.removeClass("required");
		} else {
			field.addClass("required");
		}
	}
	return valid;
} 

function validateRegularExp(field) {

	var valid = true;
	
	field = $(field);
	var regexp = field.attr('mvc-regexp');
	if (regexp != "" && field.val()) {
		valid = new RegExp(regexp).test(field.val());
		if (valid) {
			field.removeClass("invalid-regexp");
		} else {
			field.addClass("invalid-regexp");
		}
	}

	return valid;
}

function validateField(field) {
	
	var valid = validateRequiredField(field);
	if(valid) {
		validateRegularExp(field);
	}
}

function validateFields() {
	
	var fields = document.forms[0].elements;
	
	for ( var i = 0; i < fields.length; i++) {
		validateField(fields[i]);
	}
}

function validateForm(form, bypassValidate) {
	
	var fields = form.elements;
	if(bypassValidate == undefined || bypassValidate == false){
		for ( var i = 0; i < fields.length; i++) {
			
			if (!validateRequiredField(fields[i])) {
				showMessage("Complete all the required fields", "30");
				return false;
			}

			if (!validateRegularExp(fields[i])) {
				showMessage("Fill up all the fields in proper format.", "30");
				return false;
			}
		}

	}
	
	return true;
}

function disableFields(action) {
	
	var fields = document.forms[action.id].elements;
	
	for ( var i = 0; i < fields.length; i++) {
		var field = $(fields[i]);
		if (field.attr('mvc-disabled') == "true") {
			field.attr("disabled", "disabled");	
		} else {
			field.removeAttr("disabled");
		}
	}
}

function disableForm(action) {
	
	var fields = document.forms[action.id].elements;
	
	for ( var i = 0; i < fields.length; i++) {
		var field = $(fields[i]);
		if(field.attr('mvc-disabled') != "false"){
			field.attr("disabled", "disabled");
		}
	}

	$('#submit').removeAttr("disabled");
	$('#reset').removeAttr("disabled");

}
