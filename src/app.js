import { http } from './http.js';
import { ui } from './UI.js';

// getData('https://jsonplaceholder.typicode.com/posts');


function getPosts() {
  http.get('http://localhost:3000/posts').then((posts) => {
    ui.showPosts(posts);
  }).catch(error => console.log(error));
}
function submitPost() {
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;

  const data = { title, body };
  http.post('http://localhost:3000/posts', data).then((data) => {
    ui.showAlert('Post added', 'alert alert-success');
    ui.clearFields();
    getPosts();
  }).catch(err => console.log(err));
}

document.addEventListener('DOMContentLoaded', getPosts);

document.querySelector('.post-submit').addEventListener('click', submitPost);
