import Home from './home-page.js';
import CreateEdit from './create-edit-page.js';


class Context {
  constructor(state) {
    this.currentUrl = this.getUrlParams(window.location.hash);
    switch (true) {
      case this.currentUrl['#blog'] === 'new':
        this.changeState('create', this.currentUrl);
        break;
      case !isNaN(this.currentUrl['#blog']):
        this.changeState('create', this.currentUrl);
        break;
      default:
        this.changeState('home');
        break;
    }
    console.log(this.currentUrl);
  }

  changeState(state, params) {
    switch (state) {
      case 'home':
        this.state = new Home();
        break;
      case 'create':
        this.state = new CreateEdit(params);

        break;
      default:
        this.state = new Home();
    }
  }

  getUrlParams(url) {
    const hashes = url.slice(url.indexOf('?') + 1).split('&');
    return hashes.reduce((params, hash) => {
      const [key, val] = hash.split('=');
      return Object.assign(params, { [key]: decodeURIComponent(val) });
    }, {});
  }

  request() {
    this.state.handle(this);
  }
}

export default Context;
