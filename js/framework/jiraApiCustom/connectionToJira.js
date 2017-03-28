//Develop methods to getAuthentication on Jira Globant and 

function getHashStr(){
  var userObject = JSON.parse(localStorage.getItem("userObject"));
  var usr = userObject.username;
  var pass = userObject.password;
  
  var basicScheme = btoa(usr + ':' + pass);
  var hashStr = "Basic " + basicScheme;
  //console.log(hashStr);
  return hashStr;
}
 //"application/x-www-form-urlencoded;charset=ISO-8859-15"
 //'GET' 'POST'
function setAuthHeader(xhr, value){
  xhr.setRequestHeader('Authorization', getHashStr());
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://jira.corp.globant.com');
  //xhr.setRequestHeader('Access-Control-Request-Headers', 'https://jira.corp.globant.com');
  xhr.setRequestHeader('Access-Control-Allow-Methods', value);
  xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  xhr.setRequestHeader('Access-Control-Max-Age', '86400');
  xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
}


function getAjaxSetupConnection(value){

  $.ajaxSetup({  
      beforeSend: function (xhr){
        setAuthHeader(xhr, value); 
      }
  });
  
}
