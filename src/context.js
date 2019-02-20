import Home from './home-page.js';
import CreateEdit from './create-edit-page.js';

class Context {
  constructor(state) {
    this.changeState(state);
  }

  changeState(state) {
    switch (state) {
      case 'home':
        this.state = new Home();
        break;
      case 'create':
        this.state = new CreateEdit();

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
