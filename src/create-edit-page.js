import MediumEditor from 'medium-editor';
import lottie from 'lottie-web';
import PageState from './page-state.js';


class CreateEdit extends PageState {
  constructor(params = 0) {
    super();
    this.parameters = params;
  }

  async handle(context) {
    document.location.hash = '🌘';
    this.tags = [];
    this.createMenu();
    this.createEditBody();

    this.postContentContainer = document.querySelector('#post-content');
    this.postTemplate = await this.getPostTemplate();
    this.addNewPostContent();
    this.imgURL = document.querySelector('#url');
    this.imgElement = document.querySelector('.post-create-image');
    console.log(this.imgElement);
    this.listenImgChange();
    this.stateChanger = context;
    this.listenHomeState();
    this.listenSave();
    this.listenHeart();
  }

  async getPostTemplate() {
    const template = this.http.get(`${this.domain}template/1`);
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
    const defaulImg = 'assets/img/roses.jpeg';

    this.mainContainer.innerHTML = `
      <div>
        <div class="post-create-image" tabindex="0" style='background-image: url("${defaulImg}")'>
          <input type="hidden" name=""> 
          <input class="title" id="title" type="text" value="Your title..." autocomplete="off">
          <div class="popout-menu">
            <label for="url">Image url:</label>
            <input name="url" type="text" id="url" value="${defaulImg}">
          </div>
        </div>
      </div>
      <div>
        <div class="post-content" id="post-content">

        </div>
      </div>
      
    `;
  }

  addNewPostContent() {
    const editable = document.createElement('div');
    editable.classList.add('editable');
    editable.innerHTML = this.postTemplate.post;
    this.postContentContainer.appendChild(editable);
    this.editor = new MediumEditor('.editable');
  }

  listenImgChange() {
    ['keyup', 'paste'].forEach(event => this.imgURL.addEventListener(event, () => {
      this.imgElement.style.backgroundImage = `url(${this.imgURL.value})`;
    }));
  }

  async getTags() {
    const tags = await this.http.get(`${this.domain}tags`);
    return tags;
  }
}

export default CreateEdit;
