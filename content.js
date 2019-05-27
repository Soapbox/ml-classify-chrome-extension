function createTextNode(text, className) {
  let node = document.createElement("span");
  node.classList.add(className);
  let textNode = document.createTextNode(text);
  node.appendChild(textNode);
  return node;
}

function createBlogPost(post) {
  console.log(post);
  let postNode = document.createElement("div");
  postNode.classList.add("blog-post");
  postNode.appendChild(createTextNode(post.title, 'blog-post-title'));
  postNode.appendChild(createTextNode(post.publication_date, 'blog-post-date'));
  postNode.appendChild(createTextNode(post.category, 'blog-post-category'));
  return postNode;
}

function addBlogs(response) {
  let parentNode = document.createElement("div");
  parentNode.classList.add("blog-posts");

  for (let i = 0, s = response.blogs.length; i < s; i++) {
    console.log(response.blogs[i]);
    parentNode.appendChild(createBlogPost(response.blogs[i]));
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
}

setTimeout(
  function() {
    var items = document.getElementsByClassName('link-to');
    for (var i = 0, l = items.length; i < l; i++) {
      if(items[i].parentElement.className === 'list-item__body') {
        let index = i;
        let afterResponse = (data) => {addClassification(data, index);};
        chrome.runtime.sendMessage(
            {api: "acceptItem", item:items[i].innerText},
            response => afterResponse(JSON.parse(response))
        );
      }
    }

    let sampleResponse = {
      blogs: [
        {
          title: 'This is a long post title: with no emoji',
          publication_date: '12 May 2018',
          category: 'Productive Meetings'
        },
        {
          title: 'This is another long post title: making it more diverse',
          publication_date: '12 May 2018',
          category: 'Productive Meetings'
        },
        {
          title: 'This is a short post title',
          publication_date: '12 May 2018',
          category: 'Productive Meetings'
        }
      ]
    };

    addBlogs(sampleResponse);

  }, 5000);