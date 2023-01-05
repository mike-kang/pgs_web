class Area {
  constructor(path){
    this.path = path; //array Point
  }
}

class Point {
  //정규화된 점이다.
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
    this.canvas = document.getElementById(this.getAttribute('canvas'));
    this.canvas_ctx = this.canvas.getContext('2d');

    this.canvas.width = this.background_width;
    this.canvas.height = this.background_height;

    this.areas = {};
    console.log(AreasEditorDiv.TAG, 'connectedCallback()', this.areas);
    this.temp_area_path = [];
    this.addEventListener( "click" , this.clickHandler, false);

  }
  
  setAreasChangeListener(areaUpdateListener, areaRemoveListener){
    this.areaUpdateListener = areaUpdateListener;
    this.areaRemoveListener = areaRemoveListener;
  }

  clickHandler(me)    {
    console.log(AreasEditorDiv.TAG, "canvas click", me.offsetX/this.background_width, me.offsetY/this.background_height);
    //moving이 발생하면 해당 click 무시.
    if(this.isMoved){
      this.isMoved = false;
      return;
    }

    this.canvas_ctx.strokeStyle = 'red';
    this.canvas_ctx.lineWidth = 3;

    this.canvas_ctx.beginPath();
    this.canvas_ctx.arc(me.offsetX , me.offsetY, 1, 0, Math.PI * 2);
    if(this.temp_area_path.length > 0){
      this.canvas_ctx.moveTo(this.temp_area_path[this.temp_area_path.length-1].x * this.background_width , this.temp_area_path[this.temp_area_path.length-1].y * this.background_height);
      this.canvas_ctx.lineTo(me.offsetX , me.offsetY);
      this.canvas_ctx.stroke();
    }
    this.canvas_ctx.fill();
    this.temp_area_path.push(new Point(me.offsetX / this.background_width, me.offsetY / this.background_height));

  }

  areaSet(id){
    console.log(AreasEditorDiv.TAG, "areaSet ", id, this);
    if(this.temp_area_path.length < 3){
      this.areaCancel();
      return;
    }
    this.areas[id] = new Area(this.temp_area_path);
    this.temp_area_path = [];    
    this.drawAreas();
    this.areaUpdateListener(id, this.areas[id].path);

  }
  areaCancel(){
    this.temp_area_path = [];
    this.drawAreas();
  }
  areaRemove(id){
    delete this.areas[id];
    this.drawAreas();
    this.areaRemoveListener(id);
  }
  areaBack(id){
    this.temp_area_path.pop();
    this.drawAreas();
  }
  getAreas(){
    console.log(this.areas);
    return this.areas;
  }
  //정규화된 점들로 이뤄진 path를 가진 area의 map
  setAreas(areas){
    this.areas = areas;
    this.temp_area_path = [];    

    this.drawAreas();
  }

  onCanvasResize(){
    //console.log(AreasEditorDiv.TAG, "onCanvasResize");
    this.canvas.width = this.background_width;
    this.canvas.height = this.background_height;
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
 
    for(const id in this.areas){
      let area = this.areas[id];
      if(area){
        this.drawArea(area.path);

        //display id
        let center_x = 0;
        let center_y = 0;
        area.path.forEach(point => {
          center_x += point.x * this.canvas.width;
          center_y += point.y * this.canvas.height;
        });
        center_x /= area.path.length;
        center_y /= area.path.length;
        canvas_ctx.fillText(id, center_x, center_y);
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
    canvas_ctx.lineWidth = 3;

    canvas_ctx.beginPath();
    //canvas_ctx.arc(area_path[0].x * this.canvas.width, area_path[0].y * this.canvas.height, 5, 0, Math.PI * 2);
    //canvas_ctx.fill();
    for(let i = 1; i < area_path.length; i++){
      let x = area_path[i].x * this.canvas.width;
      let y = area_path[i].y * this.canvas.height;
      canvas_ctx.beginPath();
      //canvas_ctx.arc(x, y, 5, 0, Math.PI * 2);
      //canvas_ctx.fill();
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