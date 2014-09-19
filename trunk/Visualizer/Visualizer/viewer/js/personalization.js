function personalization($rootScope) {

	
	$rootScope.updateBanner=function(banner) {
		$rootScope.userPersonalBanner = banner;
	};
	
	$rootScope.changeFont= function(fontValue){
		$rootScope.userPersonalFont = fontValue;
	};
	
	$rootScope.updateTheme=function(theme)
	{
		$rootScope.userPersonalTheme =theme;
		if(theme!='')
		{
			$('#theme').attr('href','viewer/css/themes/'+theme+'.css');
		}
	};
	
	$rootScope.updateOptionBarPosition = function(option){
		$rootScope.userPersonalOptionBar=option;
		if(option=='top'){
			$('#optionBarTop').append($('#optionBar'));
			$('#optionBarBottom').html('');
		}else if(option=='bottom'){
			$('#optionBarBottom').append($('#optionBar'));
			$('#optionBarTop').html('');
		}
	};
};


