import PageState from './page-state.js';

class Home extends PageState {
  handle(context) {
    this.createMenu();
  }

  createMenu() {
    this.navbar.innerHTML = `
        <div class="flex">
            <h1>lacasaca.com</h1>
            <div></div>
        </div>
        <div id='tagsBar'></div>
    `;
  }

  async getPosts() {
    const posts = await this.http.get(this.domain);
    console.log(posts);
  }
}

export default Home;
