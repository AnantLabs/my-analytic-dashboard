function formatDate(date, format) {

	if (date) {

		var dd = "", mm = "", yyyy = "", c  = "0";
		var yy1 = "19", yy2 = "";
		
		if (date.indexOf("-") != -1) { // YYYY-MM-DD

			var datePart = date.split("-");
			dd = datePart[2],  mm = datePart[1], yy2 = datePart[0].substring(2, 4);
			
		} else if (date.indexOf("/") != -1) {

			var datePart = date.split("/");
			if (datePart[2].length == 2) { // MM/DD/YY

				yy2 = datePart[2];
				dd = datePart[1] , mm = datePart[0];

			} else { // MM/DD/YYYY
				
				dd = datePart[1], mm = datePart[0], yy2 = datePart[2].substring(2, 4);
			}

		} else if (date.length == 7) { // CYYMMDD
			
			c = date.substring(0, 1);
			yy2 = date.substring(1, 3);

			dd = date.substring(5, 7), mm = date.substring(3, 5);
		}else if (date.length == 6) { // MMDDYY
			
			yy2 = date.substring(4, 6);
			dd = date.substring(2, 4), mm = date.substring(0, 2);
		}
		
		if (yy2 <= 39) {
			yy1 = "20";
			c = "1";
		}
		yyyy = yy1 + yy2;
		
		if(format == "mm/dd/yyyy") {
			date = mm + '/' + dd + '/' + yyyy; 
		//
		} else if (format == "mm/dd/yy") {
			date = mm + '/' + dd + '/' + yyyy.substring(2, 4);
		//
		} else if (format == "yyyy-mm-dd") {
			date = yyyy + '-' + mm + '-' + dd;
		//
		} else if (format == "yymmdd") {
			date = yyyy.substring(2, 4) + mm + dd;
		//
		} else if (format == "mmddyy") {
			date =  mm + dd + yyyy.substring(2, 4);
		//
		} else { // CYYMMDD
			date = c + yyyy.substring(2, 4) + mm + dd;
		}
		
		return date;
	}
}

function padRight(str, num, char) {
	if(!str) {
		str = "";
	}
	var count = num - str.length;
    for (var i = 0; i < count; i++) {
    	str += char;
    }
    return str;
}

function padLeft(str, num, char) {
	if(!str) {
		str = "";
	}
	var count = num - str.length;
    for (var i = 0; i < count; i++) {
    	str = char + str;
    }
    return str;
}

function fill(value, filler, size) {
	
	if(!value) {
		value = "";
	}
	
	if(filler == " "){
		while(value.length < size){
			value = value + " ";
		}
	} else if(filler == "0"){
		while(value.length < size){
			value = "0" + value;
		}
	}
	
	return value;
}

function showPopup(divId, callingEvent){
	
	$('#'+divId.id).offset({top: callingEvent.clientY-40,left: callingEvent.clientX + 10});
} 


function parseBrowserDOM(DOMobj){
	if (navigator.userAgent.match(/MSIE 10/i) ? true : false){//IE10 
		return event.srcElement;
	}else{
		return DOMobj.event.target;
	}	
}