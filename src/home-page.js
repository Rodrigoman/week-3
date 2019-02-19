import PageState from './page-state.js';

class Home extends PageState {
  async handle(context) {
    this.createMenu();
    this.posts = await this.getPosts();
    this.createPostsCointainer();
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

  async getTags() {
    const tags = await this.http.get(`${this.domain}tags`);
    return tags;
  }

  async getPosts() {
    const posts = await this.http.get(`${this.domain}posts`);
    return posts;
  }

  createPostsCointainer() {
    let postList = '';
    console.log(this.posts);
    this.posts.forEach((post) => {
      const ramdomPhoto = `https://picsum.photos/400/?random${Math.random()}`;
      const validPhoto = post.featuredImage ? post.featuredImage : ramdomPhoto;
      postList += `
        <div class="card">
          <div class="card-body">
            <h3>${post.title}</h3>
            <p class="card-text truncate-text-multiline">${post.body}</p>
            <span>${post.author}</span>
          </div>
          <div class="small-image">
            <img src="${validPhoto}" alt="" srcset="">
          </div>
        </div>
    `;
    });
    this.mainContainer.innerHTML = `
    <div class="postContainer">
        ${postList}
    </div>
    `;
  }
}

export default Home;
