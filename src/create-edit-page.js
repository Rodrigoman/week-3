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
    this.state = 'reading';
    this.post = await this.getPostTemplate();
    this.allTags = await this.getAllTags();

    this.createMenu();
    this.createEditBody();

    this.postContentContainer = document.querySelector('#post-content');
    this.fillPostContent();
    this.imgURL = document.querySelector('#url');
    this.imgElement = document.querySelector('.post-create-image');
    this.listenImgChange();
    this.stateChanger = context;
    this.listenHomeState();
    this.listenHeart();

    this.confirmDelete = 0; // if this get to 60 delete post
  }

  async getPostTemplate() {
    if (this.parameters['#blog'] === 'new') {
      this.isNew = true;
      this.state = 'editing';
      const template = this.http.get(`${this.domain}template/1`);
      return template;
    }
    const template = this.http.get(`${this.domain}posts/${this.parameters['#blog']}`);
    return template;
  }

  createMenu() {
    this.navbar.innerHTML = `
        <div class="flex">
            <h1 id="homeState">lacasaca.es</h1>
        </div>
    `;
  }

  createEditBody() {
    let defaulImg = 'assets/img/roses.jpeg';
    let title = 'Your title...';
    let tags = '';
    let date = new Date();

    if (!this.isNew) {
      defaulImg = this.post.featuredImage === '' ? defaulImg : this.post.featuredImage;
      title = this.post.title === '' ? title : this.post.title;
      tags = this.post.tags === undefined ? title : this.post.tags;
      date = this.post.date === undefined ? date : this.post.date;
    }

    this.mainContainer.innerHTML = `
      <div class="${this.state}"></div>
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
        <div class="meta-info">
        <span class="card-text" >${moment(date).format('MMM D h:m')}</span>
          <input type="text" id="tags" class="tags" placeholder="Enter your tags separated by comma" value="${tags}">
        </div>
      </div>
      <div>
        <div class="post-content" id="post-content">

        </div>
        <div class="heart">
          <div id="heart" style="width: 100%;"> 
        </div>
        <div class="state">
          <div class="state">
            <div id="currentSate"></div> 
          </div>
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
    this.currentState();
  }

  currentState() {
    let edit = '<img id="edit" src="assets/img/edit.svg" style="width: 100%;"></img>';
    const stateDiv = this.mainContainer.querySelector('#currentSate');
    stateDiv.innerHTML = edit;
    if (this.state !== 'reading') {
      edit = `
        <img id="save" src="assets/img/save.svg" style="width: 100%;"></img><br>
        <div class="delete">
          <div id="delete"></div>
        </div>`;
      stateDiv.innerHTML = edit;
      this.deleteAnimation = lottie.loadAnimation({
        container: document.querySelector('#delete'), // the dom element that will contain the animation
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'assets/img/trash.json', // the path to the animation json
        name: 'delete',
      });
      this.listenDelete();
      this.listenDeleteOut();
      this.listenSave();
    } else { // we are reading
      this.listenEdit();
    }
  }

  fillPostContent() {
    const editable = document.createElement('div');
    editable.classList.add('editable');
    editable.innerHTML = this.post.body;
    this.postContentContainer.appendChild(editable);
    this.editor = new MediumEditor('.editable');
  }

  listenImgChange() {
    ['keyup', 'paste'].forEach(event => this.imgURL.addEventListener(event,
      () => {
        this.imgElement.style.backgroundImage = `url(${this.imgURL.value})`;
      }));
  }

  async getAllTags() {
    const tags = await this.http.get(`${this.domain}tags`);
    return tags;
  }

  async savePost() {
    const featuredImage = this.imgURL.value;
    const title = document.querySelector('#title').value;
    const body = this.editor.elements[0].innerHTML;
    const desc = this.editor.elements[0].getElementsByTagName('P')[0].innerHTML;
    const { id } = this.post;
    const date = new Date();
    let tags = [...new Set(document.querySelector('#tags').value.replace(/\s/g, '').split(','))];
    tags = tags.map(tag => tag.toUpperCase());
    await this.saveTags(tags);
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
  async saveTags(tags){
    tags.forEach(newTag => {
      const isOld = this.allTags.find(dbTag => { return (dbTag.name === newTag)})
      if(!isOld){
        this.http.post(`${this.domain}tags/`,{ 'name':newTag })
      }

    })
  }

  async deletePost() {
    const deleted = await this.http.delete(`${this.domain}posts/${this.post.id}`);
    this.deleting = false;
    this.deleteAnimationHandler();
    this.goToHome();
  }

  listenHomeState() {
    document.querySelector('#homeState').addEventListener('click', (e) => {
      e.preventDefault();
      this.goToHome();
    });
  }

  goToHome() {
    this.stateChanger.changeState('home');
    this.stateChanger.request();
  }

  listenSave() {
    document.querySelector('#save').addEventListener('click', (e) => {
      this.savePost();
    });
  }

  listenEdit() {
    document.querySelector('#edit').addEventListener('click', (e) => {
      e.stopPropagation();
      this.state = 'editing';
      document.querySelector('.reading').style.display = 'none';
      this.currentState();
    });
  }

  listenHeart() {
    document.querySelector('#heart').addEventListener('click', (e) => {
      this.heartAnimation.goToAndPlay(15, true);
    });
  }

  listenDelete() {
    document.querySelector('#delete').addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.deleting = true;
      this.deleteAnimationHandler();
    });
  }

  listenDeleteOut() {
    document.querySelector('#delete').addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.deleting = false;
      this.deleteAnimationHandler();
    });
  }

  deleteAnimationHandler() {
    if (this.deleting === true) {
      this.interval = setInterval(() => {
        this.confirmDelete += 1;
        if (this.confirmDelete >= 60) {
          this.deletePost();
        }
        this.deleteAnimation.setSpeed(0.6);
        this.deleteAnimation.setDirection(1);
        this.deleteAnimation.play();
      }, 30);
    } else {
      clearInterval(this.interval);
      this.confirmDelete = 0;
      this.deleteAnimation.setSpeed(1);
      this.deleteAnimation.setDirection(-1);
      this.deleteAnimation.play();
    }
  }
}

export default CreateEdit;
