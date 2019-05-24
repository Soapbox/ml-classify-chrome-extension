let addClassification = (response, i) => {

  var items = document.getElementsByClassName('link-to');

  let sortResp = [];
  for (let key in response.categories) {
    sortResp.push([key, response.categories[key]]);
  }

  sortResp.sort(function(a, b) {
    return b[1] - a[1];
  });

  let mapping = {
    Accountability: 'Accountability',
    Autonomy: 'Autonomy',
    Employee_motivation: 'Employee Motivation',
    Great_communication: 'Great Communication',
    Growth_and_development: 'Growth and Development',
    Management_skills: 'Management Skills',
    Performance: 'Performance'
  };

  let parentNode = document.createElement("div");
  parentNode.classList.add("ml-tags");

  for (let j = 0, s = sortResp.length; j < s; j++) {
    let perc = Math.round(parseFloat(sortResp[j][1]) * 1000) / 10;
    if (perc >= 20) {
      let node = document.createElement("span");
      let textnode = document.createTextNode(mapping[sortResp[j][0]]);
      node.appendChild(textnode);
      node.title = "Predicted: "+perc+"%";
      node.classList.add("ml-tag");
      parentNode.appendChild(node);
    }
  }

  items[i].parentElement.appendChild(parentNode);
};


setTimeout(
  function() {
    var items = document.getElementsByClassName('link-to');
    for (var i = 0, l = items.length; i < l; i++) {
      if(items[i].parentElement.className === 'list-item__body') {
        let index = i;
        let afterResponse = (data) => {addClassification(data, index);};

        chrome.runtime.sendMessage({api: "acceptItem",item:items[i].innerText}, function(response) {

          console.log(response);
          afterResponse(response);

        });
        /*
        $.ajax({
          contentType: 'application/json',
          crossDomain: true,
          data: JSON.stringify({sample: items[i].innerText}),
          success: function(data){
            afterResponse(JSON.parse(data));
          },
          error: function(){
            console.log("Failed");
          },
          type: 'POST',
          url: 'http://13.57.13.174:8081/sample'
        });
        */

      }
    }
  }, 5000);
