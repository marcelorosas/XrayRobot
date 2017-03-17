$(document).on('click','#logInBtn',function(){
	
		var username = document.getElementById('userName');
		var password = document.getElementById('userPassword');
		  
		var userObject = {"username": ""+username.value+"", "password": ""+password.value+""};
		localStorage.setItem("userObject",  JSON.stringify(userObject));

		loginToJira();
});

  
$(document).on('click','#continueBtn',function() {
  var url = homePagePath;
  openNewWindow(url);
});  

$(document).on('click','#closeBtn',function() {
  $('#confirmModal').modal('hide');
});  


$(document).on('click','#backBtn',function() {
	var url = loginPagePath;
	openNewWindow(url);
});  

