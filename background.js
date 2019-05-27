'use strict';

let aggregateMap = {
  Accountability: 0,
  Autonomy: 0,
  Employee_motivation: 0,
  Great_communication: 0,
  Growth_and_development: 0,
  Management_skills: 0,
  Performance: 0
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.api == "acceptItem") {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://13.57.13.174:8081/sample", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var resp = JSON.parse(xhr.responseText);
        aggregateCategories(resp);
        sendResponse(resp);
      }
    };
    xhr.send(JSON.stringify({sample: request.item}));
    return true;
  }
  if (request.api == "acceptCount") {

  }
});

let aggregateCategories = (resp) => {

  let response = JSON.parse(resp);
  for (let key in response.categories) {
    let perc = parseFloat(response.categories[key]);
    aggregateMap[key] += perc;
  }

  var props = Object.keys(aggregateMap).map(function(key) {
    return { key: key, value: this[key] };
  }, aggregateMap);
  props.sort(function(p1, p2) { return p2.value - p1.value; });
  var toptwo = props.slice(0, 2);
  console.log(toptwo)
};