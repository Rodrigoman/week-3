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
  const id = document.querySelector('#id').value;


  if (title === '' || body === '') {
    ui.showAlert('Please fill in all fields', 'alert alert-danger');
  } else {
    // check for id
    const data = { title, body };
    if (id === '') {
      // create post
      http.post('http://localhost:3000/posts', data).then((data) => {
        ui.showAlert('Post added', 'alert alert-success');
        ui.clearFields();
        getPosts();
      }).catch(err => console.log(err));
    } else {
      http.put(`http://localhost:3000/posts/${id}`, data).then((data) => {
        ui.showAlert('Post updated', 'alert alert-success');
        ui.changeFormState('add');
        getPosts();
      }).catch(err => console.log(err));
    }
  }
}
function deltePost(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('delete')) {
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
function enableEdit(e) {
  if (e.target.parentElement.classList.contains('edit')) {
    const { id } = e.target.parentElement.dataset;
    const body = e.target.parentElement.previousElementSibling.textContent;
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
    const data = {
      id, body, title,
    };
    ui.fillForm(data);
  }
  e.preventDefault();
}
function cancelEdit(e) {
  if (e.target.classList.contains('post-cancel')) {
    ui.changeFormState('add');
  }
  e.preventDefault();
}

document.addEventListener('DOMContentLoaded', getPosts);

document.querySelector('.post-submit').addEventListener('click', submitPost);
document.querySelector('#posts').addEventListener('click', deltePost);
document.querySelector('#posts').addEventListener('click', enableEdit);
document.querySelector('.card-form').addEventListener('click', cancelEdit);
