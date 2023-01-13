class Area {
  constructor(path){
    this.path = path; //array Point
    this.my = this;
  }

  draw(my, canvas, color='yellow', close=true){
    if(my.path.length == 0)
      return;
    let canvas_ctx = canvas.canvas_ctx;
    canvas_ctx.strokeStyle = color;
    canvas_ctx.lineWidth = 3;

    canvas_ctx.beginPath();
    //canvas_ctx.arc(area_path[0].x * this.width, area_path[0].y * this.height, 5, 0, Math.PI * 2);
    //canvas_ctx.fill();
    let area_path = this.my.path;
    for(let i = 1; i < area_path.length; i++){
      let x = area_path[i].x * canvas.width;
      let y = area_path[i].y * canvas.height;
      canvas_ctx.beginPath();
      //canvas_ctx.arc(x, y, 5, 0, Math.PI * 2);
      //canvas_ctx.fill();
      canvas_ctx.moveTo(area_path[i - 1].x * canvas.width , area_path[i - 1].y * canvas.height);
      canvas_ctx.lineTo(x, y);
      canvas_ctx.stroke();
    }
    if(close){
      canvas_ctx.moveTo(area_path[area_path.length-1].x * canvas.width , area_path[area_path.length-1].y * canvas.height);
      canvas_ctx.lineTo(area_path[0].x * canvas.width , area_path[0].y * canvas.height);
      canvas_ctx.stroke();
    }
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


class AreasEditorBaseCanvas extends HTMLCanvasElement {
  static TAG = '[AreasEditorBaseCanvas]';
  constructor() {
      super();
      console.log(AreasEditorBaseCanvas.TAG, this);
  }
  
  connectedCallback() {
    console.log(AreasEditorBaseCanvas.TAG, 'connectedCallback()');
    this.canvas_ctx = this.getContext('2d');

    this.width = Number(this.getAttribute('width'));
    this.height = Number(this.getAttribute('height'));

    this.layout_width = Number(this.style.width.replace('px', ''));
    this.layout_height = Number(this.style.height.replace('px', ''));

    this.areas = {};
    console.log(AreasEditorBaseCanvas.TAG, 'connectedCallback()', this.areas);

  }
  
  setAreasChangeListener(areaUpdateListener, areaRemoveListener){
    this.areaUpdateListener = areaUpdateListener;
    this.areaRemoveListener = areaRemoveListener;
  }

  getAreas(){
    console.log(this.areas);
    return this.areas;
  }
  //정규화된 점들로 이뤄진 path를 가진 area의 map
  setAreas(areas){
    this.areas = areas;
    this.draw();
  }

  onCanvasResize(w, h){
    //console.log(AreasEditorBaseCanvas.TAG, "onCanvasResize");
    this.layout_width = w;
    this.layout_height = h;
    this.draw();
  }

  draw(clear=true){
    console.log(AreasEditorBaseCanvas.TAG, "draw", this);
    let canvas_ctx = this.canvas_ctx;
    if(clear)
      canvas_ctx.clearRect(0, 0, this.width, this.height);
    var fontSize = 60;
    canvas_ctx = this.canvas_ctx;
    canvas_ctx.lineWidth = 2;

    canvas_ctx.textAlign = 'center';
    canvas_ctx.textBaseline = 'middle';
    canvas_ctx.font = fontSize + 'px serif'; 
    canvas_ctx.fillStyle = 'yellow';
 

    for(const id in this.areas){
      let area = this.areas[id];
      if(area){
        area.draw(area, this);

        //display id
        let center_x = 0;
        let center_y = 0;
        area.path.forEach(point => {
          center_x += point.x * this.width;
          center_y += point.y * this.height;
        });
        center_x /= area.path.length;
        center_y /= area.path.length;
        canvas_ctx.fillText(id, center_x, center_y);
        //canvas_ctx.strokeText(i + 1, center_x, center_y);
      }
    }
  }


}

