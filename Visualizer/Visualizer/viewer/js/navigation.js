
// Function written for sliding bars and expanding/collapsing rows

function showMenubar(value){
	if(value=='right'){
		$("#menuright").collapse('show');
		$("#sliderRight").removeClass("imgSideBarTabOpen");
		$("#sliderRight").addClass("imgSideBarTabClose");		
	}else{
		$("#menuleft").collapse('show');
		$("#sliderLeft").removeClass("imgSideBarTabClose");
		$("#sliderLeft").addClass("imgSideBarTabOpen");
	}
}

function toggleClasses(obj){
	if($(obj).attr('toggletarget').length > 2){
		var target = $('#'+$(obj).attr('toggletarget'));
		var toggleClass = $(obj).attr('mvc-toggle-class').split(" ");
		var classFirst = toggleClass[0];
		var classSecond = toggleClass[1];
		if(target.hasClass(classFirst)){
			target.removeClass(classFirst);
			target.addClass(classSecond);
		}else{
			target.removeClass(classSecond);
			target.addClass(classFirst);
		}
	}
}

//Updating the font size when clicked on Font Resizer button

function toggleFontSize() {
	 try{
		if($('#divFontResizer').hasClass('resizerFontUp')) {
			$('.outerdiv').removeClass('resizeBig');
		} else {
			$('.outerdiv').addClass('resizeBig');
		}
		setContentSize(currentPage);
		resizeGrid();
	 }catch(err){}
}

//function to refresh grid's width
function resizeGrid(){
	$('.grid').trigger('resize'); 
}

// function to iniate events when page is loaded
function initiateEventBinding(){
	$('#menuleft').on('hidden', function () {
		resizeGrid();
	});
	$('#menuleft').on('shown', function () {
		resizeGrid();
	});
	$('#menuright').on('hidden', function () {
		resizeGrid();
	});
	$('#menuright').on('shown', function () {
		resizeGrid();
	});
}

//method to collapse the pane which have hidden parameter in the attribute when the page laods
function checkCollapse(){
	$(".collapse[autocollapsed='true']").collapse('hide').each( function() {
		toggleClasses($("#i_"+this.id));
	});
}

$( window ).resize(function() {
	setContentSize(currentPage);
	
	if(angular.element($(".homeDiv")).scope() != undefined){
		initializePagination(angular.element($(".homeDiv")).scope());
	}
});

function IsInputTypeSupported(typeName) {

    var input = document.createElement("input");
    // attempt to set the specified type
    input.setAttribute("type", typeName);
    // If the "type" property equals "text" then that input type is not supported by the browser
    var val = (input.type !== "text");
    delete input;
    return val;
}

var currentPage;

function setContentSize(page){
	
	if(page == 'modal_screen'){
		return;
	}
	currentPage = page;
	
	var headerSize = $('#headerContainer').height();
	var footerSize = $('#footerContainer').height();
	var screenSize = $(window).innerHeight();
	if($('.outerdiv').hasClass('resizeBig')){
		$('#divFontResizer').addClass('resizerFontDown').removeClass('resizerFontUp');
		screenSize = screenSize * .93 ; //reducing screen size when font are increased
	}
	var innerContainerHeight = 0;
	var optionbarHeight = $('#optionBar').height();
	var buttonContainer = $('.buttonholder').height();
	
	if(page == 'home'){
		var maintenanceRow = 160;
		footerSize = 30;
		innerContainerHeight = screenSize - (headerSize + footerSize + maintenanceRow + 40);
		$("#homeCarousel").css("height",innerContainerHeight - 30 +"px");
	}else if(page == 'screen'){
		var titlebarHeight = $('#titlebar').height();
		innerContainerHeight = screenSize - (headerSize + titlebarHeight + footerSize + optionbarHeight + 20);
		$('#innerContent').css("height",innerContainerHeight - buttonContainer + "px");
		
	}else if(page == 'reports'){
		var titlebarHeight = $('#titlebar').height();
		if(buttonContainer==0){buttonContainer=34;}
		innerContainerHeight = screenSize - (headerSize + titlebarHeight + footerSize + optionbarHeight + 20);
		$('#innerContent').css("height",innerContainerHeight - buttonContainer + "px");
		
	}else if(page == 'nav_screen'){
		//setting first the height of content and sidebars
		var staticContentHeight = $('#staticContent').height(); 
		var subheaderHeight = $('#subheader').height() + $('#home').height();
		innerContainerHeight = screenSize - (headerSize + footerSize + optionbarHeight + staticContentHeight + 50);
		var staticContentLeftHt = $('#staticContentLeft').height();
		//setting internal heights of the sidebars
		$('#navigationlinkList').css("height",(innerContainerHeight - staticContentLeftHt)+"px");
		$('#activities').css("max-height", innerContainerHeight-50 +"px");
		$('#screenAction').css("max-height", innerContainerHeight-50 +"px");
		$('#innerContent').css("height", innerContainerHeight - (subheaderHeight + buttonContainer) + "px");
	}
	
	$(".fixedHeightViewport").css("height",innerContainerHeight+"px");
}

//Function to initialize Sorting of Home page application

function initializeSorting(scope,list,Personalization)
{
	var appsSorted = false;
	scope.sortableOptions = {
		 start: function(e, ui){
			 $("#droppedItems").addClass("ui-state-hover");
		 },	
		 update: function(e, ui){
			 appsSorted=true;
		 },
		 stop: function(e, ui) {
			 if(appsSorted){
				 Personalization.saveHomePersonalisationData("appsAdded",list);
			 }
			 if($(event.target).parents("div#droppedItems").attr('id')=='droppedItems'){
				  var appname = angular.element(ui.item[0]).scope().applications.appname;
				  scope.modifyApp(appname);
			 }
			 appsSorted=false;
			 $("#droppedItems").removeClass("ui-state-hover");
		 }
	};	
}


// Function to initialize the Pagination
function initializePagination(scope){
	var addedAppsCount = 0;
	scope.pageSize = getPageSize();
	angular.forEach(scope.homeConfig.homeConfigList,  function(key,value) {
		if(key.appadded=='yes'){
			addedAppsCount++;
		}
	});
	
  	var pageCount= Math.ceil(addedAppsCount/scope.pageSize);                
  	scope.getNoOfPages=[];
    for (var i=0;i<pageCount;i++)
    {
    	scope.getNoOfPages[i] = i;
    }
}

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
	return function(input, start) {
	  start = +start; 
	  return input.slice(start);
	};
});

function getPageSize(){
		var pageSize=8;
		var appsHeight = 130 ; //Height of Applications displayed on the home page
		var carouselHeight = $('#homeCarousel').height();
		var innerWidth  = $(window).innerWidth();
		var rows = Math.floor(carouselHeight/appsHeight);
		var columns = 4 ; //default
		
		if(innerWidth < 768){
			columns = 1;
		}
		pageSize = rows * columns;
		return pageSize;
};
