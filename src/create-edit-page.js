import MediumEditor from 'medium-editor';
import lottie from 'lottie-web';
import PageState from './page-state.js';


class CreateEdit extends PageState {
  constructor(params = 0) {
    super();
    this.parameters = params;
  }

  async handle(context) {
    this.isNew = false;

    this.postTemplate = await this.getPostTemplate();
    this.tags = [];
    this.createMenu();
    this.createEditBody();

    this.postContentContainer = document.querySelector('#post-content');
    this.fillPostContent();
    this.imgURL = document.querySelector('#url');
    this.imgElement = document.querySelector('.post-create-image');
    this.listenImgChange();
    this.stateChanger = context;
    this.listenHomeState();
    this.listenSave();
    this.listenHeart();
  }

  async getPostTemplate() {
    if (this.parameters['#blog'] === 'new') {
      this.isNew = true;
      const template = this.http.get(`${this.domain}template/1`);
      return template;
    }
    const template = this.http.get(`${this.domain}posts/${this.parameters['#blog']}`);
    return template;
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
        </div>
        <div id='tagsBar'>
          ${tagList}
        </div>
    `;
  }

  createEditBody() {
    let defaulImg = 'assets/img/roses.jpeg';
    let title = 'Your title...';

    if (!this.isNew) {
      defaulImg = this.postTemplate.featuredImage === '' ? defaulImg : this.postTemplate.featuredImage;
      title = this.postTemplate.title === '' ? title : this.postTemplate.title;
    }

    this.mainContainer.innerHTML = `
      <div>
        <div class="post-create-image" tabindex="0" style='background-image: url("${defaulImg}")'>
          <input class="title" id="title" type="text" value="${title}" autocomplete="off">
          <div class="popout-menu">
            <label for="url">Image url:</label>
            <input name="url" type="text" id="url" value="${defaulImg}">
          </div>
        </div>
      </div>
      <div>
        <div class="tags">
          <input type="text" id="tags" class="tags" placeholder="Enter your tags separated by comma">
        </div>
      </div>
      <div>
        <div class="post-content" id="post-content">

        </div>
        <div class="heart">
          <div id="heart" style="width: 100%;"> 
        </div>
        <div class="save">
          <img id="save" src="assets/img/save.svg" style="width: 100%;"> 
        </div>
      </div>`;
    this.heartAnimation = lottie.loadAnimation({
      container: document.querySelector('#heart'), // the dom element that will contain the animation
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'assets/img/heart.json', // the path to the animation json
      name: 'heart',
    });
  }

  fillPostContent() {
    const editable = document.createElement('div');
    editable.classList.add('editable');
    editable.innerHTML = this.postTemplate.body;
    this.postContentContainer.appendChild(editable);
    this.editor = new MediumEditor('.editable');
  }

  listenImgChange() {
    ['keyup', 'paste'].forEach(event => this.imgURL.addEventListener(event,
      () => {
        this.imgElement.style.backgroundImage = `url(${this.imgURL.value})`;
      }));
  }

  async getTags() {
    const tags = await this.http.get(`${this.domain}tags`);
    return tags;
  }

  async savePost() {
    const featuredImage = this.imgURL.value;
    const title = document.querySelector('#title').value;
    const body = this.editor.elements[0].innerHTML;
    const desc = this.editor.elements[0].getElementsByTagName('P')[0].innerHTML;
    const { id } = this.postTemplate;
    const date = new Date();
    let tags = [...new Set(document.querySelector('#tags').value.replace(/\s/g, '').split(','))];
    tags = tags.map(tag => tag.toUpperCase());
    if (this.isNew) {
      this.http.post(`${this.domain}posts`, {
        featuredImage, title, body, desc, date, tags,
      });
    } else {
      this.http.put(`${this.domain}posts/${id}`, {
        featuredImage, title, body, desc, tags,
      });
    }
  }

  listenHomeState() {
    document.querySelector('#homeState').addEventListener('click', (e) => {
      e.preventDefault();
      this.stateChanger.changeState('home');
      this.stateChanger.request();
    });
  }

  listenSave() {
    document.querySelector('#save').addEventListener('click', (e) => {
      e.stopPropagation();
      this.savePost();
    });
  }

  listenHeart() {
    document.querySelector('.heart').addEventListener('click', (e) => {
      e.stopPropagation();
      this.heartAnimation.goToAndPlay(15, true);
    });
  }
}

export default CreateEdit;
