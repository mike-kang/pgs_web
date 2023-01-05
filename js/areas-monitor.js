class AreasMonitorDiv extends ZoomDiv {
  static TAG = '[AreasMonitorDiv]';
  constructor() {
      super();
      console.log(AreasMonitorDiv.TAG, this);
  }

  connectedCallback() {
    console.log(AreasMonitorDiv.TAG, 'connectedCallback()');
    super.connectedCallback();
    this.areas = [];

  }

  setAreas(areas){
    this.areas = areas;
    this.drawAreas();
  }

  onCanvasResize(){
    console.log(AreasMonitorDiv.TAG, "resize");
    this.drawAreas();
  }

  drawAreas(clear=true){
    console.log(AreasMonitorDiv.TAG, "drawAreas");
    if(clear)
      this.canvas_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
          center_x += point.x * this.canvas.width;
          center_y += point.y * this.canvas.height;
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

customElements.define('areas-monitor', AreasMonitorDiv, {extends: 'div'});