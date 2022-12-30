class Point {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  distance(p){
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    return Math.sqrt( dx * dx + dy * dy );
  }
  calAngle(origin){
    return Math.atan2(this.y - origin.y, this.x - origin.x);
  }
  addAngle(origin, delta_angle){
    let x = this.x - origin.x;
    let y = this.y - origin.y;
    this.x = x * Math.cos(delta_angle) - y * Math.sin(delta_angle) + origin.x;
    this.y = x * Math.sin(delta_angle) + y * Math.cos(delta_angle) + origin.y;
  }
}

class AreasEditorDiv extends ZoomDiv {
  static TAG = '[AreasEditorDiv]';
  constructor() {
      super();
      console.log(AreasEditorDiv.TAG, this);
  }
  
  connectedCallback() {
    console.log(AreasEditorDiv.TAG, 'connectedCallback()');
    super.connectedCallback();

    this.areas = new Array(20);
    for(let i = 0; i < 20; i++){
      this.areas[i] = null;
    }
    this.temp_area_path = [];
    this.addEventListener( "click" , this.clickHandler, false);

  }

  clickHandler(me)    {
    console.log(AreasEditorDiv.TAG, "canvas click", me.offsetX/this.canvas.width, me.offsetY/this.canvas.height);
    //moving이 발생하면 해당 click 무시.
    if(this.isMoved){
      this.isMoved = false;
      return;
    }
    this.canvas_ctx.strokeStyle = 'red';
    this.canvas_ctx.lineWidth = 4;

    this.canvas_ctx.beginPath();
    this.canvas_ctx.arc(me.offsetX , me.offsetY, 5, 0, Math.PI * 2);
    if(this.temp_area_path.length > 0){
      this.canvas_ctx.moveTo(this.temp_area_path[this.temp_area_path.length-1].x * this.canvas.width , this.temp_area_path[this.temp_area_path.length-1].y * this.canvas.height);
      this.canvas_ctx.lineTo(me.offsetX , me.offsetY);
      this.canvas_ctx.stroke();
    }
    this.canvas_ctx.fill();
    this.temp_area_path.push(new Point(me.offsetX / this.canvas.width, me.offsetY / this.canvas.height));

  }

  areaSet(id){
    if(this.temp_area_path.length < 3){
      this.areaCancel();
      return;
    }
    this.areas[id] = {path:this.temp_area_path};
    //for(let i = 0; i < this.temp_area_path.length; i++){
    //
    //}
    this.temp_area_path = [];    
    this.drawAreas();

  }
  areaCancel(){
    this.temp_area_path = [];
    this.drawAreas();
  }
  areaRemove(id){
    this.areas[id] = null;
    this.drawAreas();
  }
  areaBack(id){
    this.temp_area_path.pop();
    this.drawAreas();
  }
  getAreas(){
    console.log(this.areas);
    return this.areas;
  }
  setAreas(areas){
    for(let i = 0; i < areas.length; i++){
      if(areas[i] == null){
        this.areas[i] = null;
      }
      else{
        this.areas[i].path = JSON.parse(JSON.stringify(areas[i]));
      }
    }
    this.drawAreas();
  }

  onCanvasResize(){
    //console.log(AreasEditorDiv.TAG, "onCanvasResize");
    this.drawAreas();
  }
  onCanvasMove(){
    this.isMoved = true;
  }

  drawAreas(canvas_ctx=this.canvas_ctx, clear=true){
    console.log(AreasEditorDiv.TAG, "drawAreas");
    if(clear)
      canvas_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var fontSize = 24;
    canvas_ctx.lineWidth = 2;

    canvas_ctx.textAlign = 'center';
    canvas_ctx.textBaseline = 'middle';
    canvas_ctx.font = fontSize + 'px serif'; 
    canvas_ctx.fillStyle = 'yellow';
 
    for(let i = 0; i < this.areas.length; i++){
      let area = this.areas[i];
      if(area != null){
        this.drawArea(area.path);

        //display id
        let center_x = 0;
        let center_y = 0;
        area.path.forEach(point => {
          center_x += point.x * this.canvas.width;
          center_y += point.y * this.canvas.height;
        });
        center_x /= area.length;
        center_y /= area.length;

        canvas_ctx.fillText(i + 1, center_x, center_y);
        //canvas_ctx.strokeText(i + 1, center_x, center_y);
      }
    }
    //temp_area_path
    this.drawArea(this.temp_area_path, 'red', false);
  }

  drawArea(area_path, color='yellow', close=true){
    let canvas_ctx=this.canvas_ctx;
    if(area_path.length == 0)
      return;
    canvas_ctx.strokeStyle = color;
    canvas_ctx.lineWidth = 4;

    canvas_ctx.beginPath();
    canvas_ctx.arc(area_path[0].x * this.canvas.width, area_path[0].y * this.canvas.height, 5, 0, Math.PI * 2);
    canvas_ctx.fill();
    for(let i = 1; i < area_path.length; i++){
      let x = area_path[i].x * this.canvas.width;
      let y = area_path[i].y * this.canvas.height;
      canvas_ctx.beginPath();
      canvas_ctx.arc(x, y, 5, 0, Math.PI * 2);
      canvas_ctx.fill();
      canvas_ctx.moveTo(area_path[i - 1].x * this.canvas.width , area_path[i - 1].y * this.canvas.height);
      canvas_ctx.lineTo(x, y);
      canvas_ctx.stroke();
    }
    if(close){
      canvas_ctx.moveTo(area_path[area_path.length-1].x * this.canvas.width , area_path[area_path.length-1].y * this.canvas.height);
      canvas_ctx.lineTo(area_path[0].x * this.canvas.width , area_path[0].y * this.canvas.height);
      canvas_ctx.stroke();
    }
  }
}

customElements.define('areas-editor', AreasEditorDiv, {extends: 'div'});