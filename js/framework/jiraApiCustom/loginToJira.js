
function loginToJira(){

  var base_url = "https://jira.corp.globant.com";
  $('#loginResult').html('');

  getAjaxSetupConnection();
  
  var doLogin = $.get(
    
    base_url + '/rest/auth/1/session',
    
    function (data, status, xhr) { 
      setAuthHeader(xhr);
    }
  )
  .success(function(data) {
    var node = '<h5><div id="confirmMsg" style="text-align:left;">Successfully logged in!</div></h5>';  
    $('#loginResult').html(node);
    var url = homePagePath;
    openNewWindow(url);
  })
  .error(function(response) {
    console.log("Error:", response); 
    var node = '<h5><div id="confirmMsg" style="text-align:left;"><strong>Error: </strong> Your username or/and password are invalid. Please, try it again!</div></h5>';  
    $('#loginResult').html(node);
    var closeBtn = '<button type="button" id ="closeBtn" class="btn btn-default" data-dismiss="modal">Close</button>';
    $('#modalLoginResult').html(closeBtn);
    $('#confirmModal').modal('show');    
  })

};

