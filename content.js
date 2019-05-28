let counter = 0;
let arrItems = [];

let mapping = {
  Accountability: 'Accountability',
  Autonomy: 'Autonomy',
  Employee_motivation: 'Employee Motivation',
  Great_communication: 'Great Communication',
  Growth_and_development: 'Growth and Development',
  Management_skills: 'Management Skills',
  Performance: 'Performance'
};

function createTextNode(text, className) {
  let node = document.createElement('span');
  node.classList.add(className);
  let textNode = document.createTextNode(text);
  node.appendChild(textNode);
  return node;
}

function createBlogPost(post) {
  let postNode = document.createElement('a');
  postNode.setAttribute('href', post.link);
  postNode.setAttribute('target','_blank',);

  let postDiv = document.createElement('div');
  postDiv.classList.add('blog-post');
  postDiv.appendChild(createTextNode(post.title, 'blog-post-title'));
  postDiv.appendChild(createTextNode(mapping[post.category], 'blog-post-category'));

  postNode.appendChild(postDiv);
  return postNode;
}

function addBlogs(response) {
  let parentNode = document.createElement('div');
  parentNode.classList.add('blog-posts');

  for (let i = 0, s = response.length; i < s; i++) {
    if (response[i].link !== "") {
      parentNode.appendChild(createBlogPost(response[i]));
    }
  }

  let containers = document.getElementsByClassName('page-layout__container');
  console.log(containers);
  let container = containers[0];
  container.appendChild(parentNode);
}

function addClassification(response, i) {
  var items = document.getElementsByClassName('link-to');

  let sortResp = [];
  for (let key in response.categories) {
    sortResp.push([key, response.categories[key]]);
  }

  sortResp.sort(function(a, b) {
    return b[1] - a[1];
  });

  let parentNode = document.createElement('div');
  parentNode.classList.add('ml-tags');

  for (let j = 0, s = sortResp.length; j < s; j++) {
    let perc = Math.round(parseFloat(sortResp[j][1]) * 1000) / 10;
    if (perc >= 20) {
      let node = document.createElement('span');
      let textnode = document.createTextNode(mapping[sortResp[j][0]]);
      node.appendChild(textnode);
      node.title = 'Predicted: '+perc+'%';
      node.classList.add('ml-tag');
      parentNode.appendChild(node);
    }
  }

  items[i].parentElement.appendChild(parentNode);
  counter++;
  if (counter === arrItems.length) {
    getBlogPosts();
  }
}

function getBlogPosts() {
  chrome.runtime.sendMessage(
      {api: 'getBlogPosts'},
      response => addBlogs(JSON.parse(response))
  );
}


setTimeout(
  function() {
    let items = document.getElementsByClassName('link-to');
    for (var i = 0; i < items.length; i++) {
      if(items[i].parentElement.className === 'list-item__body') {
        arrItems.push({idx: i, text: items[i].innerText});
      }
    }

    for (var j = 0; j < arrItems.length; j++) {
      let index = arrItems[j].idx;
      let addResponse = (response) => addClassification(response, index);
      chrome.runtime.sendMessage(
          {api: 'acceptItem', item: arrItems[j].text},
          response => addResponse(JSON.parse(response))
      );
    }
  }, 5000);