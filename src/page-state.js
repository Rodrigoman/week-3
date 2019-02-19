import { http } from './http.js';

const navbar = document.querySelector('#navbar');
const mainContainer = document.querySelector('#mainContainer');
const domain = `http://${window.location.hostname}:3000/`;

class PageState {
  constructor() {
    this.domain = domain;
    this.http = http;
    this.navbar = navbar;
    this.mainContainer = mainContainer;
  }
}

export default PageState;
