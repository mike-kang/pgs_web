//ZoomDiv는 div elemnet를 상속받은 class이다.
//container 역할을 하며, 포함하는 element들을 zoom in/out할 수 있게 하며, 자동으로 스크롤이 생성된다. 
//ctrl + wheel로 zoom in/out이 되며,
//mouse down + move로 화면을 이동할 수 있다.
//child element들 중, size 맞추기 위한 기준이되는 것을 background로 정한다. 
class ZoomDiv extends HTMLDivElement {
  static TAG = '[ZoomDiv]';
  constructor() {
      super();
      console.log(ZoomDiv.TAG, this);
  }

  connectedCallback() {
      console.log(ZoomDiv.TAG, 'connectedCallback()');
      this.background = document.getElementById(this.getAttribute('background'));
      this.background_width = Number(this.background.style.width.replace('px', ''));
      this.background_height = Number(this.background.style.height.replace('px', ''));

      for (const child of this.children) {
        console.log(ZoomDiv.TAG, child.tagName);
      }
      for (let child of this.children) {
        child.style.width = this.background_width + 'px';
        child.style.height = this.background_height + 'px';
        child.style.position = 'absolute';
      }

      this.width = Number(this.style.width.replace('px', ''));
      this.height = Number(this.style.height.replace('px', ''));
      //console.log(ZoomDiv.TAG, 'connectedCallback()', this.width);

      //default zoom enable
      if(this.getAttribute('zoom') == null){
        this.setAttribute('zoom', 'enable');
      }
  }

  disconnectedCallback() {
      console.log('disconnectedCallback()');
      // browser calls this method when the element is removed from the document
      // (can be called many times if an element is repeatedly added/removed)
  }
  static get observedAttributes() {
    return ['zoom']
    // name 이라는 attribute 바뀌는지 감지
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    //바뀌면 실행
    console.log('Custom square element attributes changed.', newValue);
    if(name == 'zoom'){
      if(newValue == 'enable'){
        this.addEventListener('wheel', this.wheelHandler, false);
        this.addEventListener( "mousedown" , this.mouseDownHandler, false);
      }
      else{
        this.changeBackgroundSize(0);
        this.removeEventListener('wheel', this.wheelHandler);
        this.removeEventListener('mousedown', this.mouseDownHandler);
      }
    }
  }

  adoptedCallback() {
      console.log('adoptedCallback()');
      // called when the element is moved to a new document
      // (happens in document.adoptNode, very rarely used)
  }

  wheelHandler(event){
    //console.log('zoom', event.deltaY);
    if (event.ctrlKey) {
        event.preventDefault();
        this.changeBackgroundSize(event.deltaY);
    }
  }

  /**
 * 확대시 화면 이동을 위해
 * @param {*} e 
 */
  mouseDownHandler(me){
    //console.log("mousedown", me.offsetX/this.background_width, me.offsetY/this.background_height);

    this.mouse_grab_pos = {
      left: this.scrollLeft,
      top: this.scrollTop,
      x: me.clientX,
      y: me.clientY,
    };
    this.addEventListener('mousemove', this.mouseMoveHandler, false);
    this.addEventListener('mouseup', this.mouseUpHandler, false);

  }
  /**
 * 확대시 화면 이동을 위해
 * @param {*} e 
 */
  mouseMoveHandler(e) {
    //console.log('mouseMoveHandler', e);
    
    const dx = e.clientX - this.mouse_grab_pos.x;
    const dy = e.clientY - this.mouse_grab_pos.y;

    if (Math.abs(e.movementX) + Math.abs(e.movementY) > 1) {
        this.scrollTop = this.mouse_grab_pos.top - dy;
        this.scrollLeft = this.mouse_grab_pos.left - dx;

        this.style.cursor = 'grabbing';
        this.style.userSelect = 'none';
        if(this.onCanvasMove != undefined)
          this.onCanvasMove();
        //isMoved = true;
    }
    
  };

  /**
  * 확대시 화면 이동을 위해
  */
  mouseUpHandler() {
    //console.log('mouseUpHandler');

    this.removeEventListener('mousemove', this.mouseMoveHandler, false);
    this.removeEventListener('mouseup', this.mouseUpHandler, false);

    this.style.cursor = 'default';
    this.style.removeProperty('user-select');
  };

  /**
 * 스케일 조정된 이미지 화면 표시
 */
  changeBackgroundSize(delta) {
    let scale;
    if(delta == 0)
      scale = 0;
    else  
      scale = (delta > 0)? 0.9 : 1.1;
    
    let preWidth = this.background_width;
    let preHight = this.background_height;

    this.background_width *= scale;
    this.background_height *= scale;
    this.background_width = Math.max(this.background_width, this.width);
    this.background_height = Math.max(this.background_height, this.height);

    for (let child of this.children) {
      child.style.width = this.background_width + 'px';
      child.style.height = this.background_height + 'px';
    }

    //console.log('this.canvas.style.width = ' + this.canvas.width, this.canvas.style.width);
    this.scrollLeft += (this.background_width - preWidth) / 2;
    this.scrollTop += (this.background_height - preHight) / 2;
    
    for (let child of this.children) {
      if(child.onCanvasResize != undefined)
        child.onCanvasResize(this.background_width, this.background_height);
    }
  
  }


  //onCanvasResize(){
  //}

}

customElements.define('zoom-div', ZoomDiv, {extends: 'div'});