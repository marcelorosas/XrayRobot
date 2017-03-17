//Develop methods to getAuthentication on Jira Globant and 

function getHashStr(){
  var userObject = JSON.parse(localStorage.getItem("userObject"));
  var usr = userObject.username;
  var pass = userObject.password;
  
  var basicScheme = btoa(usr + ':' + pass);
  var hashStr = "Basic " + basicScheme;
  return hashStr;
}

function setAuthHeader(xhr){
  xhr.setRequestHeader('Authorization', getHashStr());
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://jira.corp.globant.com');
  xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
  xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  xhr.setRequestHeader('Access-Control-Max-Age', '86400');
  xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
}

function setAuthHeaderPost(xhr){
  xhr.setRequestHeader('Authorization', getHashStr());
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Access-Control-Allow-Origin', 'https://jira.corp.globant.com');
  xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
  xhr.setRequestHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  xhr.setRequestHeader('Access-Control-Max-Age', '86400');
  xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
}

function getAjaxSetupConnection(){

  $.ajaxSetup({  
      beforeSend: function (xhr){
        setAuthHeader(xhr); 
      }
  });
  
}
