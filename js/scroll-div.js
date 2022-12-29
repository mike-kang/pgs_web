class ScrollDiv extends HTMLDivElement {
  static TAG = '[ScrollDiv]';
  constructor() {
      super();
      console.log(ScrollDiv.TAG, this);
  }

  connectedCallback() {
      console.log(ScrollDiv.TAG, 'connectedCallback()');
      this.canvas = document.createElement('canvas');
      this.canvas_ctx = this.canvas.getContext('2d');
      this.background = document.getElementById(this.getAttribute('background'));
      this.canvas.width = Number(this.background.style.width.replace('px', ''));
      this.canvas.height = Number(this.background.style.height.replace('px', ''));
      this.canvas.style.position = 'absolute';
      this.background.style.position = 'absolute';
      this.appendChild(this.canvas);

      this.width = Number(this.style.width.replace('px', ''));
      this.height = Number(this.style.height.replace('px', ''));
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
    console.log('zoom', event.deltaY);
    if (event.altKey) {
        event.preventDefault();
        this.changeBackgroundSize(event.deltaY);
    }
  }

  /**
 * 확대시 화면 이동을 위해
 * @param {*} e 
 */
  mouseDownHandler(me){
    console.log("mousedown", me.offsetX/this.canvas.width, me.offsetY/this.canvas.height);

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
    console.log('mouseMoveHandler', e.movementX);
    
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
    console.log('mouseUpHandler');

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
    
    let preWidth = this.canvas.width;
    let preHight = this.canvas.height;

    this.canvas.width *= scale;
    this.canvas.height *= scale;
    this.canvas.width = Math.max(this.canvas.width, this.width);
    this.canvas.height = Math.max(this.canvas.height, this.height);

    this.canvas.style.width = this.background.style.width = this.canvas.width + 'px';
    this.canvas.style.height = this.background.style.height = this.canvas.height + 'px';
    //console.log('this.canvas.style.width = ' + this.canvas.width, this.canvas.style.width);
    this.scrollLeft += (this.canvas.width - preWidth) / 2;
    this.scrollTop += (this.canvas.height - preHight) / 2;
    if(this.onCanvasResize != undefined)
      this.onCanvasResize();

  }


  //onCanvasResize(){
  //}

}

customElements.define('scroll-div', ScrollDiv, {extends: 'div'});