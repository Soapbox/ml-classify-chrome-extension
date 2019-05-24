'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.api == "acceptItem") {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://13.57.13.174:8081/sample", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp = JSON.parse(xhr.responseText);
        sendResponse(resp);
      }
    };
    xhr.send(JSON.stringify({sample: request.item}));
    return true;
  }
});
