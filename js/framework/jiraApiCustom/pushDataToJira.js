// Method to update the issue status in Jira
// TCID is the issue id created in Jira
// Id is the transition id for the wanted status
function updateIssueStatusInJira(TCID, Id){
	getAjaxSetupConnection('POST');

	var jsonData = {
		"transition": {
	        "id": Id 
	    }
	}

    $.ajax({
		url: base_url + '/rest/api/latest/issue/' + TCID + '/transitions?expand=transitions.fields',
		data: JSON.stringify(jsonData),
		success: function (data, status, xhr) { 
			console.log(xhr);
		},
		async: false,
		type: 'POST',
		error: function (error) { console.log(error.responseText);}
	});			
}

function pushTestCasesInJira(testCases, globantId){
	var sol = []; //USID, TCID, Description, Status
	var index = 0;
	var userObject = JSON.parse(localStorage.getItem("userObject"));
  	var userName = userObject.username;
  	console.log(userName);
  	getAjaxSetupConnection('POST');

	for (test in testCases){
		index++;
		var statusTC = ' ';
		var USIDKey = ' ';
		var newTCIDKey = ' ';
		
		console.log("Creating the test ", testCases[test].TC);
		console.log("Sprint: ", testCases[test].Sprint);
		var summaryTC = testCases[test].TC + " - " + testCases[test].Description.match(/[^\n]+(?:\r?\n|$)/g);
		summaryTC = summaryTC.split(".")[0];
		if (summaryTC.length > 255){
			summaryTC = chunkString(summaryTC, 255)[0];
		}	
		console.log(summaryTC);			
		
		var descriptionTC = "Description: \n" + testCases[test].Description + "\n\n Preconditions: \n" + testCases[test].Preconditions + "\n\n Steps: \n" + testCases[test].Steps + "\n\n Expected Result: \n" + testCases[test].ExpectedResult; 
		
		descriptionTC = descriptionTC.replace(/&#10;/g,'');
		console.log(descriptionTC);
		
		//The Id of Globant Jira (globantId) corresponding to the User Story (Test set)
		
		USIDKey = globantId; 
		console.log("USIDKEY: " + USIDKey);
		
		var jsonTC = {
			"fields": {
				"project":
				{ 
					"key": testCases[test].ProjectKey
				},
				"summary": summaryTC,
				"description": descriptionTC,
				"issuetype": {
					"name": "Test"
				},
				"assignee": {
					"name": userName
				}
			},
			"update": {
				"issuelinks": [{
					"add": {
						"type": {
							"name": "Relates"
						},
						"inwardIssue": {
							"key": USIDKey
						}
					}
				}]
			}
		}
		
		
	    $.ajax({
			url: base_url + '/rest/api/2/issue',
			data: JSON.stringify(jsonTC),
			success: function (data, status, xhr) { 
				//console.log(data, status, xhr);
				statusTC = status;
				newTCIDKey = data.key;
				//Add status to the sol
				sol.push({USID:testCases[test].USID, TCID:testCases[test].TC, Summary:summaryTC , Status: statusTC, NewTCID: newTCIDKey, Sprint:testCases[test].Sprint});
				//Assign the test cases to the respective sprint
				//https://developer.atlassian.com/blog/2015/12/totw-using-the-JIRA-Software-REST-API/
				//  IMPORTANT 857 is the project id here:
			  	//  https://jira.corp.globant.com/rest/greenhopper/latest/sprintquery/857?includeHistoricSprints=true&includeFutureSprints=true
				

				var sprints = [];
				
				for (s in sol)
				{
					var sprintIssues = sprints[sol[s].Sprint];
					if(!sprintIssues)
					{
						sprintIssues = {'issues': []};							
					}
					sprintIssues["issues"].push(sol[s].NewTCID);
					sprints[sol[s].Sprint] = sprintIssues;
					
					console.log(sprintIssues);
				}

				console.log(result);
				//Update Sprint value
				for (sprintNumber in sprints){
					var result = sprints[sprintNumber];
					$.post(
						base_url + '/rest/agile/1.0/sprint/' + sprintNumber + '/issue',
						JSON.stringify(result),
						function (data, status, xhr) { 
							console.log('The issue status is updated successfully');
						}
					)
				}		
			},
			async: false,
			type: 'POST',
			error: function (error) { 
				statusTC = error.responseText;
				sol.push({USID:testCases[test].USID, TCID:testCases[test].TC, Summary:summaryTC , Status: statusTC, NewTCID: newTCIDKey, Sprint:testCases[test].Sprint});			
			}
		});
		
		console.log("Created Issue in Jira-Globant: "+ newTCIDKey);
		
		// Creating a json for transition to change the issue status 'On Design' to 'Design Completed'	
		// ID=11 : You can get the id value using the following url for a ticket which has the status setted: 
		// https://jira.corp.globant.com/rest/api/latest/issue/MDT002-XXX/transitions?expand=transitions.fields 
		updateIssueStatusInJira(newTCIDKey, 11);

	    // Updating the json for transition to change the issue status 'Ready For Review' to 'Review Completed'	-> 'Ready For Execution' status
		// ID=31
		updateIssueStatusInJira(newTCIDKey, 31);
		
		// The test is added to the Test Set
		addTestToTestSet(newTCIDKey, globantId);

		// Get the testExecID value
		var testExecID = localStorage.getItem("glbTestExecId");
		
		// Associates tests with the test execution created previously
		addTestToTestExecution(newTCIDKey, testExecID);

  		// Import execution result
  		updateTestResultInTestExecution(newTCIDKey, testExecID);
		
		// Display the result
		var node = document.createElement('tr');        
		node.innerHTML = '<tr><td style="text-align: center; vertical-align: middle;"> ' + index + '</td><td style="text-align: left; vertical-align: middle;"><p>'+ sol[test].USID +'</p></td><td style="text-align: left; vertical-align: middle;"><p>'+ sol[test].TCID +'</p></td><td style="text-align: left; vertical-align: middle;"><p>'+ sol[test].Summary +'</p></td><td style="text-align: left; vertical-align: middle;"><p>'+ sol[test].Status +'</p></td></tr>';  
		document.getElementById('table-result-page').appendChild(node); 
	}
}

function createUsAsTestSetInGlbJira(usId, projectKey){
	getAjaxSetupConnection('POST');
	var globantId = null;
	var userObject = JSON.parse(localStorage.getItem("userObject"));
  	var userName = userObject.username;
  	// Create US in Jira
	var summaryUS =  usId + " - Test Set";
	var jsonUS = {
		"fields": {
			"project":
			{ 
				"key": projectKey
			},
			"summary": summaryUS,
			"description": 'Created by XRayRobot \n Metromile ticket link: ' + 'https://fairauto.jira.com/browse/' + usId,
			"issuetype": {
				"name": "Test Set"
			},
			"assignee": {
				"name": userName
			}
		}
	}

	$.ajax({
         url: base_url + '/rest/api/2/issue',
		 data: JSON.stringify(jsonUS),
 		 success: function (data, status, xhr) { globantId =  data.key; },
         async: false,                    
         type: "POST",
		 error: function (error) { console.log(error.responseText);}
    });

	return globantId;
}

function createUsAsTestExecutionInGlbJira(usId, projectKey){
	getAjaxSetupConnection('POST');
	var globantTestExecId = null;
	var userObject = JSON.parse(localStorage.getItem("userObject"));
  	var userName = userObject.username;
  	// Create Test Execution in Jira
	var summaryUS =  usId + " - Test Execution";
	var jsonTestExec = {
		"fields": {
			"project":{ 
				"key": projectKey
			},
			"summary": summaryUS,
			"description": 'Created by XRayRobot',
			"issuetype": {
				"name": "Test Execution"
			},
			"assignee": {
				"name": userName
			},
			"fixVersions": [{
				"id": "15526"
			}]
		}
	}

	$.ajax({
         url: base_url + '/rest/api/2/issue',
		 data: JSON.stringify(jsonTestExec),
 		 success: function (data, status, xhr) { 
 		 	globantTestExecId =  data.key; 
 		 	console.log(data);
 		 },
         async: false,                    
         type: "POST",
		 error: function (error) { 
		 	console.log(error.responseText);
		 }
    });

	return globantTestExecId;
}

function addTestToTestSet(testCaseID, testSetID){
	getAjaxSetupConnection('POST');
	
	var jsonTest = JSON.stringify([testCaseID]);
	console.log(jsonTest);

  	$.ajax({
  		url: base_url + '/rest/raven/1.0/testset/'+ testSetID + '/tests',
		data: jsonTest,
		success: function (data, status, xhr) { 
			console.log('Successfully associated the test #' + testCaseID + ' with the test set #' + testSetID);
		},
		async: false,                    
		type: "POST",
		error: function (error) { 
		 	console.log(error.responseText);
		}
    });
}

function addTestToTestExecution(testCaseID, testExecID){
	getAjaxSetupConnection('POST');
	var jsonTest = {
	    "keys": [
	     	testCaseID
	    ]
	}

  	$.ajax({
		url: base_url + '/rest/raven/1.0/testexec/'+ testExecID + '/test',
		data: JSON.stringify(jsonTest),
		success: function (data, status, xhr) { 
			console.log('Successfully associated the test #' + testCaseID + ' with the test execution #' + testExecID);
		},
		async: false,                    
		type: "POST",
		error: function (error) { 
		 	console.log(error.responseText);
		}
    });
}

function updateTestResultInTestExecution(testCaseID, testExecID){
	//Setting up connection to use http POST method
	getAjaxSetupConnection('POST');
	$.ajax({
		url: base_url + '/rest/raven/1.0/test/'+ testCaseID + '/execute/'+ testExecID +'?status=0',
		success: function (data, status, xhr) { 
			console.log('The test execution result for the test case #' + testCaseID + ' is updated to PASS');
		},
		async: false,                    
		type: "POST",
		error: function (error) { 
			console.log(error.responseText);
		}
    });
}


function pushDataToJira(testCases, globantId){
	// Clean the result table page
	$('#table-result-page').html('');
	
	// Push test cases in Jira
	pushTestCasesInJira(testCases, globantId);
}