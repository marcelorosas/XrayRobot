
$(document).on('click','#backButton',function() {
	var url = homePagePath;
	openNewWindow(url);
});  

$(document).ready(function() {
	//Push and display the created tests
	pushDataToJira(JSON.parse(localStorage.getItem("testCases")), localStorage.getItem("glbid"));
});

