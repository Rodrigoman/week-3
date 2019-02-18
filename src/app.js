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
function deltePost(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('delete')) {
    console.log('delete');
    const { id } = e.target.parentElement.dataset;
    if (confirm('Are you suere?')) {
      http.delete(`http://localhost:3000/posts/${id}`)
        .then((data) => {
          ui.showAlert('post removed', 'alert alert-success');
          getPosts();
        }).catch(error => console.log(error));
    }
  }
}

document.addEventListener('DOMContentLoaded', getPosts);

document.querySelector('.post-submit').addEventListener('click', submitPost);
document.querySelector('#posts').addEventListener('click', deltePost);
