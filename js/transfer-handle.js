//회전과 이동을 위한 handle을 그리고, 회전이나 이동이 발생하면 이를 알린다.
class TranferHandle {
  static TAG = '[TranferHandle]';
  constructor(canvas, center, onChangeAngle, onChangeMove, client){
    this.canvas = canvas;
    this.canvas_ctx = this.canvas.getContext('2d');
    canvas.addEventListener('mousedown', this.mousedown);
    //canvas.onmousemove 	= this.mousemove;
    //canvas.onmouseup 	= this.mouseup;
    //console.log(TranferHandle.TAG, "constructor", width);
    this.center = center;
    canvas.client = this;
    this.rotation_r = center.y / 2;
    this.onChangeAngle = onChangeAngle;
    this.onChangeMove = onChangeMove;
    this.client = client;
  }

  static STATE_NONE = 0;
  static STATE_MOVE = 1;
  static STATE_ROTATION = 2;

  angle = 0; //radian
  rotation_handle_radius = 20;
  move_handle_radius = 20;
  state = TranferHandle.STATE_NONE;

  mousedown(e) {
    //console.log("[mdown]dragging ", dragging);
    // get the current mouse position
    let my = this.client;

    let point = new Point(e.offsetX, e.offsetY);
    console.log(TranferHandle.TAG, "mousedown", point, my.center, my.rotation_handle_radius, my.angle);
    //console.log("mx=" + mx + ", my=" + my + ", rect ", rect);
    let rotation_handle_center_point = new Point(my.center.x + my.rotation_r * Math.cos(my.angle) ,my.center.y + my.rotation_r * Math.sin(my.angle));
    console.log(TranferHandle.TAG, "mousedown", rotation_handle_center_point, point.distance(rotation_handle_center_point));
    if (point.distance(rotation_handle_center_point) < my.rotation_handle_radius) {
      // 클릭한 곳이 회전 Handle
      console.log("clicked rect");
      my.state = TranferHandle.STATE_ROTATION;
      my.prePoint = point;
      this.addEventListener('mousemove', my.mousemove);
      this.addEventListener('mouseup', my.mouseup);

    }
    else if (point.distance(my.center) < my.move_handle_radius) {
      // 클릭한 곳이 중앙점
      console.log("clicked circle");
      my.state = TranferHandle.STATE_MOVE;
      my.prePoint = point;
      this.addEventListener('mousemove', my.mousemove);
      this.addEventListener('mouseup', my.mouseup);
    }
  }

  mousemove(e) {
    let my = this.client;
    //console.log(TranferHandle.TAG, "mousemove", my.state);

    //console.log("[mmove]dragging ", dragging);
    if(my.state == TranferHandle.STATE_NONE)
      return;
    let point = new Point(e.offsetX, e.offsetY);
  
    if (my.state == TranferHandle.STATE_ROTATION) {
      // 움직인 각도 차이만큼 각 영역을 회전시키고 핸들도 회전.
      let a0 = my.prePoint.calAngle(my.center);
      let a1 = point.calAngle(my.center);
      my.angle += a1 - a0;
      //console.log(TranferHandle.TAG, "mousemove", my.angle);
      my.onChangeAngle(a1 - a0);
    }
    //클릭한 곳이 중앙점이라면
    else if (my.state == TranferHandle.STATE_MOVE) {
      my.onChangeMove(point.x - my.prePoint.x, point.y - my.prePoint.y);
    }
    my.prePoint = point;
  }

  mouseup(e) {
    let my = this.client;
    //console.log("[mup]transferMode ", transferMode);
    my.state = TranferHandle.STATE_NONE;
    this.removeEventListener('mousemove', my.mousemove);
    this.removeEventListener('mouseup', my.mouseup);
  }

  draw(clear=true){
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