//tranfer mode 지원.
class AreasEditorDiv2 extends AreasEditorDiv {
  static TAG = '[AreasEditorDiv2]';

  constructor() {
      super();
      console.log(AreasEditorDiv2.TAG, this);
  }
  static MODE_NORMAL = 0;
  static MODE_TRANSFER = 1;

  mode = AreasEditorDiv2.MODE_NORMAL;

  connectedCallback() {
    console.log(AreasEditorDiv2.TAG, 'connectedCallback()');
    super.connectedCallback();

  }

  setMode(mode){
    console.log("setMode ", this.mode, mode);
    if(mode == this.mode)
      return;
    if(mode == AreasEditorDiv2.MODE_NORMAL){
      console.log("normal");
      this.setAttribute('zoom', 'enable');
      this.addEventListener('click', this.clickHandler, false);
    }
    else{
      console.log("transfer");
      this.setAttribute('zoom', 'disable');
      this.removeEventListener('click', this.clickHandler);

    }
    this.mode = mode;
    this.drawAreas();

  }

  drawAreas(){
    super.drawAreas();
    if (this.mode == AreasEditorDiv2.MODE_TRANSFER) {
      // 중앙점과 원은 항상 똑같은 자리에 두고 회전 handle만 움직이면 됨.
      // mmove에서 움직인 거리나 각도만큼 모든 영역 이동.
      /*
      let ctx = this.canvas_ctx;
      ctx.beginPath();
      ctx.arc(centerHandle.x, centerHandle.y, centerHandle.r, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#1AFF04";
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(innerArc.x, innerArc.y, innerArc.r, innerArc.start, innerArc.end, innerArc.dir);
      ctx.strokeStyle = innerArc.color;
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#FFFFFF";
      ctx.strokeRect(spinHandle.x, spinHandle.y, spinHandle.width, spinHandle.height);
      */
    }
  }
}

customElements.define('areas-editor2', AreasEditorDiv2, {extends: 'div'});