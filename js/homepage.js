// Initialize Firebase
var config = {
	apiKey: "no,",
	authDomain: "I",
	databaseURL: "wont",
	storageBucket: "provide",
	messagingSenderId: "them"
};
firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword('noway', 'jose').catch(function(error) {
    console.log("Error:", error.code); 
    console.log("Error message:", error.message); 
});

document.addEventListener('DOMContentLoaded', function() { 
  	var submitBtn = document.getElementById('submitBtn');
	submitBtn.addEventListener('click', handleFile, false);
}, false);

var sheetNames = null;
var count_user_stories = 0;
var testCases = [];
var userStories = {};

function handleFile(e) {
		
	$('#table-confirm-page').html('');

	var files = $('#inputFile')[0].files;
	var f = files[0];
	var reader = new FileReader();
	var name = f.name;
	reader.onload = function(e) {
		if(typeof console !== 'undefined'){
			console.log("File uploaded successfully at ", new Date());	
		} 
		var data = e.target.result;
		var wb = XLSX.read(btoa(fixdata(data)), {type: 'base64'});
		
		var sheet_name_list = wb.SheetNames;
		var Sheet1A1 = wb.Sheets[sheet_name_list[0]]['A1'].v;
		
		//Element initialize
		var headers = {};
		userStories = {};
		var count_test = 0;
		testCases = [];
		count_user_stories = 0;
		_.each(sheet_name_list, function(y) { 
			var worksheet = wb.Sheets[y];

		    for(z in worksheet) {
		    	if(z[0] === '!') continue;
		     	//parse out the column, row, and value
		        var col = z.substring(0,1);
		        var row = parseInt(z.substring(1));
		        var value = worksheet[z].v;
		        
		        //store header names
		        if(row == 1) {
		        	headers[col] = value.replace(/ /g,"");
		            continue;
		        }
		      
				if (headers[col] === listColumns[0]){
					count_test++;
					testCases[count_test] = {};
					testCases[count_test][headers[col]] = value;
					if (!isElementPresent(userStories, value)){
						count_user_stories++;
						userStories[count_user_stories] = value;	
					}
				}
				else{
					testCases[count_test][headers[col]] = (!isEmpty(testCases[count_test][headers[col]])) ? testCases[count_test][headers[col]] + "\n" + value : value;
				}
			}

			createTestCasesCheckingIfUsExists(testCases);
		});	
	}
	reader.readAsArrayBuffer(f);
}

function createTestCasesCheckingIfUsExists(testCases){
	//Every test case on the spreadsheet will contain the same user story,
	//so we check just once if it exists or not, taking it from the first row
	var us = testCases[1].USID;
	var projectKey = testCases[1].ProjectKey;

	//Call firebase and check if the user story exists there
	firebase.database().ref('/userStory/' + us).once('value').then(function(snapshot) {
		var globantId = '';
		var globantTestExecId = '';
		if(snapshot.val() === null){
			//The user story does not exist so I create it and get its globantId, then save it in firebase for future reference
			globantId = createUsAsTestSetInGlbJira(us, projectKey);
			//Update test set status to 'In Progress'
			updateIssueStatusInJira(globantId, 11);
			
			//The test execution does not exist so I create it and get its globanTestExecutionId, then save it in firebase for future reference
			globantTestExecId = createUsAsTestExecutionInGlbJira(us, projectKey);
			//Update test execution status to 'In Progress'
			updateIssueStatusInJira(globantTestExecId, 11);
			
			firebase.database().ref('/userStory/' + us).set({ 'globantId' : globantId , 'globantTestExecutionId' : globantTestExecId });
		}else{
			globantId = snapshot.val().globantId;
			globantTestExecId = snapshot.val().globantTestExecutionId;
		}

		localStorage.setItem("glbid", globantId);
		localStorage.setItem("glbTestExecId", globantTestExecId);
		localStorage.setItem("testCases", JSON.stringify(testCases.slice(1)));
		openNewWindow(resultPagePath);
	});
}

//Function to validate file extension
var _validFileExtensions = [".xls",".XLS",".xlsx",".XLSX", ".ods", ".ODS"];    
function hideAlert(){
  $(document.getElementById("formatError")).addClass('hidden');
}

function Validate(oForm) {
  var arrInputs = oForm.getElementsByTagName("input");
  var icoError = document.getElementById("formatError");
  for (var i = 0; i < arrInputs.length; i++) {
      var oInput = arrInputs[i];
      if (oInput.type == "file") {
          var sFileName = oInput.value;
          if (sFileName.length > 0) {
              var blnValid = false;
              $(icoError).addClass('hidden');
              for (var j = 0; j < _validFileExtensions.length; j++) {
                  var sCurExtension = _validFileExtensions[j];
                  if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                      blnValid = true;
                      break;
                  }
              }
              if (!blnValid) {
                  $(icoError).removeClass('hidden');
                  return false;
              }
          }
      }
  }
  return true;
}
