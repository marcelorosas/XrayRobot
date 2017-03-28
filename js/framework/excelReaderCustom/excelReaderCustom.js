
var listColumns = [
	"USID",
	"Sprint",
	"Squad",
	"TC",
	"Description",
	"Preconditions",
	"Steps",
	"Expected Result",
];	

/*
var sheetNames = null;
var count_user_stories = 0;
var testCases = [];
var userStories = {};

function convertInputToJson(files){
	var f = files[0];
	var reader = new FileReader();
	var name = f.name;
	reader.onload = function(e) {
		if(typeof console !== 'undefined'){
			console.log("File uploaded successfully ", new Date());	
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
		});	
		
		//Select which test to upload
		addFeatureCheckbox(userStories, testCases);
	}
	reader.readAsArrayBuffer(f);
}

*/

function fixdata(data) {
	var res = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) res+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
	res+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
	return res;
}

function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});
	return result;
}

function unicodeToChar(text) {
   	return text.replace(/\\u[\dA-F]{4}/gi, 
          function (match) {
               return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
          });
}

function chunkString(str, length) {
	return str.match(new RegExp('.{1,' + length + '}', 'g'));
}