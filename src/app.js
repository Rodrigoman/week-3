import {http} from './http.js'
//getData('https://jsonplaceholder.typicode.com/posts');

document.addEventListener('DOMContentLoaded',getPosts);

function getPosts() {
 http.get('https://jsonplaceholder.typicode.com/posts').then(data => {
   console.log(data);
   
 }).catch(error => console.log(error))
}