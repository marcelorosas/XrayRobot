function pushTestCasesInJira(testCases, globantId){
	var sol = []; //USID, TCID, Description, Status
	var base_url = "https://jira.corp.globant.com";
	var index = 0;
	for (test in testCases){
		index++;
		var statusTC = ' ';
		var USIDKey = ' ';
		var newTCIDKey = ' ';
		
		console.log("Creating the test ", testCases[test].TC);
		console.log("Sprint: ", testCases[test].Sprint);
		var summaryTC = testCases[test].TC + " - " + testCases[test].Description.match(/[^\n]+(?:\r?\n|$)/g);

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
				"description": testCases[test].Description,
				"issuetype": {
					"name": "Test"
				}
			},
			"update": {
				"issuelinks": [
					{
					"add": {
						"type": {
						"name": "Relates"
						},
						"inwardIssue": {
						"key": USIDKey
						}
					}
					}
				]
			}
		}
		
		console.log(jsonTC);
			
	    $.ajax({
			url: base_url + '/rest/api/2/issue',
			data: JSON.stringify(jsonTC),
			success: function (data, status, xhr) { 
				console.log(data, status, xhr);
				statusTC = status;
				newTCIDKey = data.key;
				//Add status to the sol
				sol.push({USID:testCases[test].USID, TCID:testCases[test].TC, Summary:summaryTC , Status: statusTC, NewTCID: newTCIDKey, Sprint:testCases[test].Sprint});

				/*Assign the test cases to the respective sprint
				  https://developer.atlassian.com/blog/2015/12/totw-using-the-JIRA-Software-REST-API/
				  IMPORTANT [some important id that I will not show] is the project id here:
			  	  https://jira.corp.globant.com/rest/greenhopper/latest/sprintquery/[some important id that I will not show]?includeHistoricSprints=true&includeFutureSprints=true
				*/

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
							console.log(data, status, xhr);
						}
					)
				}		
			},
			async: false,
			type: 'POST'});

			//Display the result
			var node = document.createElement('tr');        
    		node.innerHTML = '<tr><td style="text-align: center; vertical-align: middle;"> ' + index + '</td><td style="text-align: left; vertical-align: middle;"><p>'+ sol[test].USID +'</p></td><td style="text-align: left; vertical-align: middle;"><p>'+ sol[test].TCID +'</p></td><td style="text-align: left; vertical-align: middle;"><p>'+ sol[test].Summary +'</p></td><td style="text-align: left; vertical-align: middle;"><p>'+ sol[test].Status +'</p></td></tr>';  
    		document.getElementById('table-result-page').appendChild(node);  
	}
}

function createUsAsTestSetInGlbJira(usId, projectKey){
	getAjaxSetupConnection();

	var base_url = "https://jira.corp.globant.com";
	var globantId = null;
	//Create US in Jira
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
			}
		}
	}
	console.log(jsonUS);

	$.ajax({
         url: base_url + '/rest/api/2/issue',
		 data: JSON.stringify(jsonUS),
 		 success: function (data, status, xhr) { globantId =  data.key; },
         async: false,                    
         type: "POST",
		 error: function (error) { console.log('ugh');}
    });

	return globantId;
}

function pushDataToJira(testCases, globantId){
	//Clean the result table page
	$('#table-result-page').html('');

	getAjaxSetupConnection();
	pushTestCasesInJira(testCases, globantId);
}