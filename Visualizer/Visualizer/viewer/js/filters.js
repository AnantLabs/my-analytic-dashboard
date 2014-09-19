'use strict';

/* Filters */


app.filter("capitalize",function(){
    return function(item){
       var option='';
       var words = item.split(' ');
       for(var i=0;i<words.length;i++){
    	   option = option + words[i].substring(0,1).toUpperCase() + words[i].substring(1).toLowerCase()+ " " ;
       }
       return option;
    };
});