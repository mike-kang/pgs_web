//회전과 이동을 위한 handle을 그리고, 회전이나 이동이 발생하면 이를 알린다.
class TranferHandle {
  static TAG = '[TranferHandle]';
  constructor(canvas, center, onChangeAngle, onChangeMove){
    this.canvas = canvas;
    this.canvas_ctx = canvas.getContext('2d');
    canvas.addEventListener('mousedown', (event)=>{this.mousedown(this, event)});
    //canvas.onmousemove 	= this.mousemove;
    //canvas.onmouseup 	= this.mouseup;
    //console.log(TranferHandle.TAG, "constructor", width);
    this.on_mousemove = (event)=>{this.mousemove(this, event)};
    this.on_mouseup = (event)=>{this.mouseup(this, event)};
    this.center = center;
    this.rotation_r = center.y / 2;
    this.onChangeAngle = onChangeAngle;
    this.onChangeMove = onChangeMove;
  }

  static STATE_NONE = 0;
  static STATE_MOVE = 1;
  static STATE_ROTATION = 2;

  angle = 0; //radian
  rotation_handle_radius = 60;
  move_handle_radius = 60;
  state = TranferHandle.STATE_NONE;

  mousedown(self, e) {
    //console.log("[mdown]dragging ", dragging);
    // get the current mouse position
    let point = new Point(e.offsetX / self.canvas.layout_width * self.canvas.width, e.offsetY / self.canvas.layout_width * self.canvas.width);
    //console.log(TranferHandle.TAG, "mousedown", point);
    //console.log(TranferHandle.TAG, "mousedown center", self.center, point.distance(self.center));
    //console.log("mx=" + mx + ", self=" + self + ", rect ", rect);
    let rotation_handle_center_point = new Point(self.center.x + self.rotation_r * Math.cos(self.angle) ,self.center.y + self.rotation_r * Math.sin(self.angle));
    //console.log(TranferHandle.TAG, "mousedown rotation", rotation_handle_center_point, point.distance(rotation_handle_center_point));
    if (point.distance(rotation_handle_center_point) < self.rotation_handle_radius) {
      // 클릭한 곳이 회전 Handle
      console.log("clicked rect");
      self.state = TranferHandle.STATE_ROTATION;
      self.prePoint = point;
      self.canvas.addEventListener('mousemove', self.on_mousemove);
      self.canvas.addEventListener('mouseup', self.on_mouseup);
    }
    else if (point.distance(self.center) < self.move_handle_radius) {
      // 클릭한 곳이 중앙점
      console.log("clicked circle");
      self.state = TranferHandle.STATE_MOVE;
      self.prePoint = point;
      self.canvas.addEventListener('mousemove', self.on_mousemove);
      self.canvas.addEventListener('mouseup', self.on_mouseup);
    }
  }

  mousemove(self, e) {
    //console.log(TranferHandle.TAG, "mousemove", self.state);

    //console.log("[mmove]dragging ", dragging);
    if(self.state == TranferHandle.STATE_NONE)
      return;
    let point = new Point(e.offsetX / self.canvas.layout_width * self.canvas.width, e.offsetY / self.canvas.layout_width * self.canvas.width);
  
    if (self.state == TranferHandle.STATE_ROTATION) {
      // 움직인 각도 차이만큼 각 영역을 회전시키고 핸들도 회전.
      let a0 = self.prePoint.calAngle(self.center);
      let a1 = point.calAngle(self.center);
      self.angle += a1 - a0;
      self.canvas.onChangeAngle(self.canvas, a1 - a0);
    }
    //클릭한 곳이 중앙점이라면
    else if (self.state == TranferHandle.STATE_MOVE) {
      self.canvas.onChangeMove(self.canvas, point.x - self.prePoint.x, point.y - self.prePoint.y);
    }
    self.prePoint = point;
  }

  mouseup(self, e) {
    //console.log(TranferHandle.TAG, "mouseup", self);
    self.state = TranferHandle.STATE_NONE;
    self.canvas.removeEventListener('mousemove', self.on_mousemove);
    self.canvas.removeEventListener('mouseup', self.on_mouseup);
  }

  draw(clear=true){
    //console.log(TranferHandle.TAG, "draw", this);
    let ctx = this.canvas_ctx;
    let c_x = this.center.x;
    let c_y = this.center.y;
    if(clear)
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //move handle
    ctx.beginPath();
    ctx.arc(c_x, c_y, this.move_handle_radius, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();

    //rotation circle
    ctx.beginPath();
    ctx.arc(c_x, c_y, this.rotation_r, 0, 2 * Math.PI);
    ctx.strokeStyle = 'cyan';
    ctx.stroke();

    //rotation handle
    //console.log(TranferHandle.TAG, this.rotation_r, this.angle);
    ctx.beginPath();
    ctx.arc(c_x + this.rotation_r * Math.cos(this.angle) , c_y + this.rotation_r * Math.sin(this.angle), this.rotation_handle_radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

  }
}