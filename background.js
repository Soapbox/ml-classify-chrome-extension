'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // sendResponse({farewell: "goodbye1"});
  console.log('Before Jaskirts special code');
  console.log(request);
  if (request.api == "acceptItem") {
    console.log(request);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://13.57.13.174:8081/sample", true);
    //xhr.setRequestHeader('Authorization','Bearer ' + token);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp = JSON.parse(xhr.responseText);
        sendResponse(resp);
      }
    }
    xhr.send(JSON.stringify({sample: request.item}));


/*    $.ajax({
      contentType: 'application/json',
      crossDomain: true,
      data: JSON.stringify({sample: request.item}),
      success: function(data){
        sendResponse(JSON.parse(data));
      },
      error: function(){
        console.log("Failed");
      },
      type: 'POST',
      url: 'http://13.57.13.174:8081/sample'
    });
*/

    return true;
  }
});
