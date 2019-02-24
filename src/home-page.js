import PageState from './page-state.js';

class Home extends PageState {
  async handle(context) {
    document.location.hash = '';

    this.stateChanger = context;
    this.tags = await this.getTags();
    this.createMenu();
    this.listenCreateState();
    this.listenTags();
    this.listenSearch()
    this.posts = await this.getPosts();
    this.createPostsCointainer(this.posts, false);
    this.listenHomeState();
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
                <img src="assets/img/search.svg">
                <input type="text" class="search-input">
                <button id="createState" class="btn btn-primary">Create Post</button>
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
    posts.reverse().forEach((post, index) => {
      const author = post.author === undefined ? 'Rodrigo Lozano' : post.author;
      const ramdomPhoto = `https://picsum.photos/400/?random${Math.random()}`;
      const validPhoto = post.featuredImage ? post.featuredImage : ramdomPhoto;
      const { date } = post;
      const tags = post.tags ? post.tags.join(post.tags.map(tag => `<span class="tag">${tag}</span>`)) : '';

      switch (true) {
        case ((index === 0) && !fromSearch):
          firstPost += `
            <div class="first-card show-post" data-id="${post.id}">
              <div class="image-large">
                <img src="${validPhoto}">
              </div>
              <div class="card-space">
                  <div></div>
                <div>
                  <h3>${post.title}</h3>
                  <p class="card-text truncate-text-multiline">${post.desc}</p>
                  <span>${author}</span><br>
                  <span class="card-text">${moment(date).format('MMM D')} · ${tags}</span>
                </div>
              </div>
            </div>`;
          break;
        case ((index > 0) && (index <= 3) && !fromSearch):
          middlePosts += `
            <div class="middle-card show-post" data-id="${post.id}">
              <div class="small-image">
                  <img src="${validPhoto}" alt="" srcset="">
              </div>
              <div class="card-body">
                <h3>${post.title}</h3>
                <p class="card-text truncate-text-multiline">
                  ${post.desc}
                </p>
                <span>${author}</span><br>
                <span class="card-text">${moment(date).format('MMM D')} · ${tags}</span>
              </div>
            </div>`;
          break;
        case ((index === 4) && !fromSearch):
          fourth += `
          <div class="fourth-card show-post" data-id="${post.id}">
            <div class="image-large">
              <img src="${validPhoto}">
            </div>
            <h3>${post.title}</h3>
            <p class="card-text truncate-text-multiline">
              ${post.desc}
            </p>
            <span>${author}</span><br>
            <span class="card-text">${moment(date).format('MMM D')} · ${tags}</span>
          </div>
            `;
          break;
        case (index > 4 || fromSearch):
          postList += `
            <div class="card show-post" data-id="${post.id}">
              <div class="card-body">
                <h2>${post.title}</h2>
                <p class="card-text truncate-text-multiline">
                ${post.desc}</p>
                <span>${author}</span><br>
                <span class="card-text">${moment(date).format('MMM D')} · ${tags}</span>
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
    this.listenCards();
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

  searchByName() {
    const query = document.querySelector('.search-input').value.toLowerCase();
    
    const filterPost = this.posts.filter( post => {  return post.title.toLowerCase().includes(query) });
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

  listenSearch() {
    const query = document.querySelector('.search-input');
    query.addEventListener('keyup', (e) => {
      e.preventDefault();
      this.searchByName()
    });
  }
  
  listenCreateState() {
    document.querySelector('#createState').addEventListener('click', (e) => {
      e.preventDefault();
      this.stateChanger.changeState('create', {
        '#blog': 'new',
      });
      document.location.hash = 'blog=new';
      this.stateChanger.request();
    });
  }

  listenCards() {
    const cards = document.querySelectorAll('.show-post');
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = card.getAttribute('data-id');
        this.stateChanger.changeState('create', {
          '#blog': id,
        });
        document.location.hash = `blog=${id}`;
        this.stateChanger.request();
      });
    });
  }

  listenHomeState() {
    document.querySelector('#homeState').addEventListener('click', (e) => {
      e.preventDefault();
      this.stateChanger.changeState('home');
      document.location.hash = '';
      this.stateChanger.request();
    });
  }
}

export default Home;
