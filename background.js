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
  if (request.api === 'acceptItem') {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://13.57.13.174:8081/sample', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        var resp = JSON.parse(xhr.responseText);
        aggregateCategories(resp);
        sendResponse(resp);
      }
    };
    xhr.send(JSON.stringify({sample: request.item}));
    return true;
  }
  if (request.api === 'getBlogPosts') {
    var xhr = new XMLHttpRequest();
    let params = getCategories();
    xhr.open('GET', 'http://13.57.13.174:8081/get_blog'+params, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        sendResponse(xhr.responseText);
      }
    };
    xhr.send(null);
    return true;
  }
});

function getCategories() {
  let props = Object.keys(aggregateMap).map(function(key) {
    return { key: key, value: this[key] };
  }, aggregateMap);

  props.sort(function(p1, p2) { return p1.value - p2.value; });

  return "?first_category="+props[0].key+"&second_category="+props[1].key;
}

function aggregateCategories(resp) {
  let response = JSON.parse(resp);
  for (let key in response.categories) {
    let perc = parseFloat(response.categories[key]);
    aggregateMap[key] += perc;
  }
}