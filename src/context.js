import Home from './home-page.js';

class Context {
  constructor(state) {
    this.changeState(state);
  }

  changeState(state) {
    switch (state) {
      case 'home':
        this.state = new Home();
        break;
      default:
        this.state = new Home();
    }
  }

  request() {
    this.state.handle(this);
  }
}

export default Context;
