
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
