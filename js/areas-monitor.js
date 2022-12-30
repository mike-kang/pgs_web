class AreasMonitorDiv extends ZoomDiv {
  constructor() {
      super();
      this.TAG = '[AreasMonitorDiv]';

      console.log(this.TAG, this);
  }

  connectedCallback() {
    console.log(this.TAG, 'connectedCallback()');
    super.connectedCallback();
    this.areas = [];

  }

  setAreas(areas){
    this.areas = new Array(areas.length);
    for(let i = 0; i < areas.length; i++){
      if(areas[i] == null){
        this.areas[i] = null;
      }
      else{
        this.areas[i] = JSON.parse(JSON.stringify(areas[i]));
      }
    }
    this.drawAreas();
  }

  onCanvasResize(){
    console.log(this.TAG, "resize");
    this.drawAreas();
  }

  drawAreas(clear=true){
    console.log(this.TAG, "drawAreas");
    if(clear)
      this.canvas_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var fontSize = 24;
    this.canvas_ctx.lineWidth = 2;

    this.canvas_ctx.textAlign = 'center';
    this.canvas_ctx.textBaseline = 'middle';
    this.canvas_ctx.font = fontSize + 'px serif';
    this.canvas_ctx.fillStyle = 'yellow';

    for(let i = 0; i < this.areas.length; i++){
      let area = this.areas[i];
      if(area != null){
        this.drawArea(area);

        //display id
        let center_x = 0;
        let center_y = 0;
        area.forEach(point => {
          center_x += point.x * this.canvas.width;
          center_y += point.y * this.canvas.height;
        });
        center_x /= area.length;
        center_y /= area.length;
        this.canvas_ctx.fillText(i + 1, center_x, center_y);

        //display data
        this.canvas_ctx.fillText(area.data, center_x, center_y + 50);
      }
    }
  }

  drawArea(area, color='yellow', close=true){
    if(area.length == 0)
      return;
    this.canvas_ctx.strokeStyle = color;
    this.canvas_ctx.lineWidth = 4;

    this.canvas_ctx.beginPath();
    this.canvas_ctx.arc(area[0].x * this.canvas.width, area[0].y * this.canvas.height, 5, 0, Math.PI * 2);
    this.canvas_ctx.fill();
    for(let i = 1; i < area.length; i++){
      let x = area[i].x * this.canvas.width;
      let y = area[i].y * this.canvas.height;
      this.canvas_ctx.beginPath();
      this.canvas_ctx.arc(x, y, 5, 0, Math.PI * 2);
      this.canvas_ctx.fill();
      this.canvas_ctx.moveTo(area[i - 1].x * this.canvas.width , area[i - 1].y * this.canvas.height);
      this.canvas_ctx.lineTo(x, y);
      this.canvas_ctx.stroke();
    }
    if(close){
      this.canvas_ctx.moveTo(area[area.length-1].x * this.canvas.width , area[area.length-1].y * this.canvas.height);
      this.canvas_ctx.lineTo(area[0].x * this.canvas.width , area[0].y * this.canvas.height);
      this.canvas_ctx.stroke();
    }
  }
}

customElements.define('areas-monitor', AreasMonitorDiv, {extends: 'div'});