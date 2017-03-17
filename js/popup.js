document.addEventListener('DOMContentLoaded', function() { 
  var addTestBtn = document.getElementById('addTestBtn');
  addTestBtn.addEventListener('click', function() {
      var url = loginPagePath;
      openBlankWindow(url);
  }, false);
}, false);
