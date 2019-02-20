import PageState from './page-state.js';

class Home extends PageState {
  async handle(context) {
    this.tags = await this.getTags();
    this.createMenu();
    this.listenTags();
    this.posts = await this.getPosts();
    this.createPostsCointainer(this.posts, false);
  }

  createMenu() {
    let tagList = '';
    this.tags.forEach((tag, index) => {
      if (index < 13) {
        tagList += `<p class="tag">${tag.name}</p>`;
      }
    });
    this.navbar.innerHTML = `
        <div class="flex">
            <h1 id="homeState">lacasaca.es</h1>
            <div>
                <button class="btn btn-primary">Create Post</button>
            </div>
        </div>
        <div id='tagsBar'>
          ${tagList}
        </div>
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

  createPostsCointainer(posts, fromSearch = 'false') {
    let postList = '';
    let firstPost = '';
    let middlePosts = '';
    let fourth = '';
    console.log(posts);
    posts.forEach((post, index) => {
      const ramdomPhoto = `https://picsum.photos/400/?random${Math.random()}`;
      const validPhoto = post.featuredImage ? post.featuredImage : ramdomPhoto;

      switch (true) {
        case ((index === 0) && !fromSearch):
          firstPost += `
            <div class="first-card">
              <div class="image-large">
                <img src="${validPhoto}">
              </div>
              <div class="card-space">
                  <div></div>
                <div>
                  <h3>${post.title}</h3>
                  <p class="card-text truncate-text-multiline">${post.desc}</p>
                  <span>${post.author}</span>
                </div>
              </div>
            </div>`;
          break;
        case ((index > 0) && (index <= 3) && !fromSearch):
          middlePosts += `
            <div class="middle-card">
              <div class="small-image">
                  <img src="${validPhoto}" alt="" srcset="">
              </div>
              <div class="card-body">
                <h3>${post.title}</h3>
                <p class="card-text truncate-text-multiline">
                  ${post.desc}
                </p>
                <span>${post.author}</span>
              </div>
            </div>`;
          break;
        case ((index === 4) && !fromSearch):
          fourth += `
          <div class="fourth-card">
            <div class="image-large">
              <img src="${validPhoto}">
            </div>
            <h3>${post.title}</h3>
            <p class="card-text truncate-text-multiline">
              ${post.desc}
            </p>
            <span>${post.author}</span>
          </div>
            `;
          break;
        case (index > 4 || fromSearch):
          postList += `
            <div class="card">
              <div class="card-body">
                <h2>${post.title}</h2>
                <p class="card-text truncate-text-multiline">
                ${post.desc}</p>
                <span>${post.author}</span>
              </div>
              <div class="small-image">
                <img src="${validPhoto}" alt="" srcset="">
              </div>
            </div>`;
          break;
        default:
          break;
      }
    });
    if (fromSearch) {
      this.mainContainer.innerHTML = `
          <div class="postContainer">
            ${postList}
          </div>
      `;
    } else {
      this.mainContainer.innerHTML = `    
        <div>
            <div class="featured-posts">
                <div class="first">${firstPost}</div>
                <div class="middle">${middlePosts}</div>
                <div class="fourth">${fourth}</div>
            </div>
            <hr>
            <div class="postContainer">
                ${postList}
            </div>
        </div>
    `;
    }
  }

  searchTag(tag) {
    const filterPost = this.posts.filter((post) => {
      if (post.tags) {
        return post.tags.includes(tag);
      }
      return false;
    });
    this.createPostsCointainer(filterPost, true);
  }

  listenTags() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach((tag) => {
      tag.addEventListener('click', (e) => {
        this.searchTag(e.target.innerHTML);
        e.preventDefault();
      });
    });
  }
}

export default Home;
