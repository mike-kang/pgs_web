class AreasMonitorCanvas extends HTMLCanvasElement {
  static TAG = '[AreasMonitorCanvas]';
  constructor() {
      super();
      console.log(AreasMonitorCanvas.TAG, this);
  }

  connectedCallback() {
    console.log(AreasMonitorCanvas.TAG, 'connectedCallback()');
    this.canvas_ctx = this.getContext('2d');

    this.width = Number(this.getAttribute('width'));
    this.height = Number(this.getAttribute('height'));

    this.layout_width = Number(this.style.width.replace('px', ''));
    this.layout_height = Number(this.style.height.replace('px', ''));

    this.areas = [];
  }

  setAreas(areas){
    this.areas = areas;
    this.drawAreas();
  }

  onCanvasResize(){
    console.log(AreasMonitorCanvas.TAG, "resize");
    this.drawAreas();
  }

  drawAreas(clear=true){
    console.log(AreasMonitorCanvas.TAG, "drawAreas");
    if(clear)
      this.canvas_ctx.clearRect(0, 0, this.width, this.height);
    var fontSize = 24;
    this.canvas_ctx.lineWidth = 2;

    this.canvas_ctx.textAlign = 'center';
    this.canvas_ctx.textBaseline = 'middle';
    this.canvas_ctx.font = fontSize + 'px serif';
    this.canvas_ctx.fillStyle = 'yellow';

    for(const id in this.areas){
      let area = this.areas[id];
      if(area){
        this.drawArea(area.path);

        //display id
        let center_x = 0;
        let center_y = 0;
        area.path.forEach(point => {
          center_x += point.x * this.width;
          center_y += point.y * this.height;
        });
        center_x /= area.path.length;
        center_y /= area.path.length;
        this.canvas_ctx.fillText(id, center_x, center_y);

        //display data
        if(area.data)
          this.canvas_ctx.fillText(area.data, center_x, center_y + 50);
      }
    }
  }

  drawArea(area_path, color='yellow', close=true){
    let canvas_ctx=this.canvas_ctx;
    if(area_path.length == 0)
      return;
      canvas_ctx.strokeStyle = color;
      canvas_ctx.lineWidth = 4;
  
      canvas_ctx.beginPath();
      canvas_ctx.arc(area_path[0].x * this.width, area_path[0].y * this.height, 5, 0, Math.PI * 2);
      canvas_ctx.fill();
      for(let i = 1; i < area_path.length; i++){
        let x = area_path[i].x * this.width;
        let y = area_path[i].y * this.height;
        canvas_ctx.beginPath();
        canvas_ctx.arc(x, y, 5, 0, Math.PI * 2);
        canvas_ctx.fill();
        canvas_ctx.moveTo(area_path[i - 1].x * this.width , area_path[i - 1].y * this.height);
        canvas_ctx.lineTo(x, y);
        canvas_ctx.stroke();
      }
      if(close){
        canvas_ctx.moveTo(area_path[area_path.length-1].x * this.width , area_path[area_path.length-1].y * this.height);
        canvas_ctx.lineTo(area_path[0].x * this.width , area_path[0].y * this.height);
        canvas_ctx.stroke();
      }
    }
}

customElements.define('areas-monitor-canvas', AreasMonitorCanvas, {extends: 'canvas'});