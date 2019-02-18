import { http } from './http.js';
import { ui } from './UI.js';

// getData('https://jsonplaceholder.typicode.com/posts');


function getPosts() {
  http.get('https://jsonplaceholder.typicode.com/posts').then((posts) => {
    ui.showPosts(posts);
  }).catch(error => console.log(error));
}

document.addEventListener('DOMContentLoaded', getPosts);
