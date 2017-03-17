//Method: close Button trigger to close the current window
$(document).on('click','#closeButton',function() {
	closeWindow();
});

//Method: close the current windowwindow
function closeWindow(){
	window.open('','_self').close();
}

function closeLocation(){
	window.open(location, '_self').close();
}

function openNewWindow(url){
	window.open(url,'_self');
}

function openBlankWindow(url){
	window.open(url,'_blank');
}

function isEmpty(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function isElementPresent(arr, elem){
	for (e in arr){
		if (arr[e] === elem){
			return true;	
		} 
	}
	return false;
}


function findInObject(object, criteria){

  return object.filter(function(obj) {
    return Object.keys(criteria).every(function(c) {
      return obj[c] == criteria[c];
    });
  });
}
