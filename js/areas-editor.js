class AreasEditorCanvas extends AreasEditorBaseCanvas {
  static TAG = '[AreasEditorCanvas]';
  constructor() {
      super();
      console.log(AreasEditorCanvas.TAG, this);
  }
  
  connectedCallback() {
    console.log(AreasEditorCanvas.TAG, 'connectedCallback()');
    super.connectedCallback();
    console.log(AreasEditorCanvas.TAG, 'connectedCallback()', this.areas);
    this.temp_area = new Area([]);
    this.addEventListener( "click" , this.clickHandler, false);

  }
  
  setAreasChangeListener(areaUpdateListener, areaRemoveListener){
    this.areaUpdateListener = areaUpdateListener;
    this.areaRemoveListener = areaRemoveListener;
  }

  clickHandler(me)    {
    let sx = me.offsetX / this.layout_width;
    let sy = me.offsetY / this.layout_height;
    console.log(AreasEditorCanvas.TAG, "canvas click", sx, sy);
    //moving이 발생하면 해당 click 무시.
    if(this.isMoved){
      this.isMoved = false;
      return;
    }

    this.canvas_ctx.strokeStyle = 'red';
    this.canvas_ctx.lineWidth = 5;

    this.canvas_ctx.beginPath();
    this.canvas_ctx.arc(sx * this.width , sy * this.height, 3, 0, Math.PI * 2);
    if(this.temp_area.path.length > 0){
      this.canvas_ctx.moveTo(this.temp_area.path[this.temp_area.path.length-1].x * this.width , this.temp_area.path[this.temp_area.path.length-1].y * this.height);
      this.canvas_ctx.lineTo(sx * this.width , sy * this.height);
      this.canvas_ctx.stroke();
    }
    this.canvas_ctx.fill();
    this.temp_area.path.push(new Point(sx, sy));

  }

  areaSet(id){
    console.log(AreasEditorCanvas.TAG, "areaSet ", id, this);
    if(this.temp_area.path.length < 3){
      this.areaCancel();
      return;
    }
    this.areas[id] = this.temp_area;
    this.temp_area = new Area([]);    
    this.draw();
    this.areaUpdateListener(id, this.areas[id].path);

  }
  areaCancel(){
    this.temp_area = new Area([]);    
    this.draw();
  }
  areaRemove(id){
    delete this.areas[id];
    this.draw();
    this.areaRemoveListener(id);
  }
  areaBack(id){
    this.temp_area.path.pop();
    this.draw();
  }

  onCanvasMove(){
    this.isMoved = true;
  }

  draw(clear=true){
    console.log(AreasEditorCanvas.TAG, "draw");
    super.draw(clear);
    //temp_area_path
    this.temp_area.draw(this.temp_area, this, 'red', false);
  }

}

customElements.define('areas-editor-canvas', AreasEditorCanvas, {extends: 'canvas'});