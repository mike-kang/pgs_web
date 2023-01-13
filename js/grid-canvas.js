class TempGridArea {
  constructor(startX, startY, endX, endY){
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

}
class GridArea {
  constructor(ltX, ltY, rbX, rbY){  //leftTop, rightBottom
    this.ltX = ltX;
    this.ltY = ltY;
    this.rbX = rbX;
    this.rbY = rbY;
  }

  draw(ctx, color, cell_width, cell_height){
    console.log("draw", color, this.ltX * cell_width, this.ltY * cell_height, this.rbX * cell_width, this.rbY * cell_height);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    ctx.fillRect(this.ltX * cell_width, this.ltY * cell_height, (this.rbX - this.ltX + 1) * cell_width, (this.rbY - this.ltY + 1) * cell_height);
    ctx.globalAlpha = 1.0;  
  }
}

class GridCanvas extends HTMLCanvasElement {
  static TAG = '[GridCanvas]';

  static MOUSE_DOWN = 1;
  static MOUSE_MOVE = 2;
  static MOUSE_UP = 3;

  constructor() {
      super();
      console.log(GridCanvas.TAG, this);
  }

  connectedCallback() {
    console.log(GridCanvas.TAG, 'connectedCallback()');
    //super.connectedCallback();

    this.count_x = Number(this.getAttribute('count_x'));
    if(this.count_x == 0)    
      this.count_x = 20;
    this.count_y = Number(this.getAttribute('count_y'));
    if(this.count_y == 0)    
      this.count_y = 20;
    this.width = Number(this.style.width.replace('px', ''));
    this.height = Number(this.style.height.replace('px', ''));
    this.cell_w = this.width / this.count_x;
    this.cell_h = this.height / this.count_y;
    this.canvas_ctx = this.getContext('2d');

    this.areas = {};
    this.temp_area = null;
    console.log(GridCanvas.TAG, 'connectedCallback()', this.width, this.height, this.cell_w, this.cell_h);
    this.addEventListener('mousedown', this.mousedown);
    console.log(this);
    this.drawGRID();
  }

  mousedown(e) {
    //let my = this.client;

    //let point = new Point(e.offsetX, e.offsetY);
    console.log(GridCanvas.TAG, "mousedown", e.offsetX, e.offsetY);
    this.mouse_state = GridCanvas.MOUSE_DOWN;
    this.temp_area = new TempGridArea(parseInt(e.offsetX / this.cell_w), parseInt(e.offsetY / this.cell_h), 0, 0);

    this.addEventListener('mousemove', this.mousemove, false);
    this.addEventListener('mouseup', this.mouseup, false);

  }

  mousemove(e){
    console.log(GridCanvas.TAG, "mousemove", e.offsetX, e.offsetY);
    if (this.mouse_state == GridCanvas.MOUSE_DOWN) {
      this.mouse_state = GridCanvas.MOUSE_MOVE;
    }
    if (this.mouse_state == GridCanvas.MOUSE_MOVE) {
      // get the current mouse position
      this.temp_area.endX = parseInt(e.offsetX / this.cell_w);
      this.temp_area.endY = parseInt(e.offsetY / this.cell_h);
      console.log(this.temp_area);
      this.draw();
      this.mouse_state = GridCanvas.MOUSE_MOVE;
    }
  }

  mouseup(e){
    console.log(GridCanvas.TAG, "mouseup", e.offsetX, e.offsetY);
    if (this.mouse_state == GridCanvas.MOUSE_DOWN || this.mouse_state == GridCanvas.MOUSE_MOVE) {
      this.temp_area.endX = parseInt(e.offsetX / this.cell_w);
      this.temp_area.endY = parseInt(e.offsetY / this.cell_h);
      console.log(this.temp_area);
      this.draw();
      this.mouse_state = GridCanvas.MOUSE_UP;
    }
    this.removeEventListener('mousemove', this.mousemove, false);
    this.removeEventListener('mouseup', this.mouseup, false);
  }

  setAreas(areas){
    this.areas = areas;
    this.temp_area = null;    
    this.draw();
  }

  areaSet(id){
    console.log(GridCanvas.TAG, "areaSet ", id, this);
    if(this.temp_area == null)
      return;
    let t_area = this.temp_area;
    let ltX = Math.min(t_area.startX, t_area.endX);
    let ltY = Math.min(t_area.startY, t_area.endY);
    let rbX = Math.max(t_area.startX, t_area.endX);
    let rbY = Math.max(t_area.startY, t_area.endY);
    this.areas[id] = new GridArea(ltX, ltY, rbX, rbY);
    this.temp_area = null;    
    this.draw();
  }

  areaRemove(id){
    delete this.areas[id];
    this.draw();
  }

  draw(){
    //console.log(this);
    let ctx = this.canvas_ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    
    if(this.temp_area){
      let t_area = this.temp_area;
      let ltX = Math.min(t_area.startX, t_area.endX);
      let ltY = Math.min(t_area.startY, t_area.endY);
      let rbX = Math.max(t_area.startX, t_area.endX);
      let rbY = Math.max(t_area.startY, t_area.endY);
      let area = new GridArea(ltX, ltY, rbX, rbY);
      area.draw(ctx, 'red', this.cell_w, this.cell_h);
    }

    for(const id in this.areas){
      let area = this.areas[id];
      if(area){
        area.draw(ctx, 'yellow', this.cell_w, this.cell_h);
      }
    }

    this.drawGRID();
  }


  drawGRID() {
    let ctx = this.canvas_ctx;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';

    for (let i = 0; i < this.count_x; i++) {
      ctx.beginPath();
      ctx.moveTo((this.cell_w * i), 0);
      ctx.lineTo((this.cell_w * i), this.height);
      ctx.stroke();
    }
    for (var i = 0; i < this.count_y; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (this.cell_h * i));
      ctx.lineTo(this.width, (this.cell_h * i));
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }
}

customElements.define('grid-canvas', GridCanvas, {extends: 'canvas'});