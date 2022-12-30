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
    this.center = new Point(this.width / 2, this.height / 2)
    this.transfer_handle = new TranferHandle(this.canvas, this.center, this.onChangeAngle, this.onChangeMove, this);
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
  
  onChangeMove(dx, dy){
    console.log(AreasEditorDiv2.TAG, "onChangeMove", dx, dy);
    let my = this.client;
    
    for(let j = 0; j < my.areas.length; j++){
      let area = my.areas[j];
      if(area != null){
        let area_path = area.path;
        for(let i = 0; i < area_path.length; i++){
          area_path[i].x += dx / my.canvas.width;
          area_path[i].y += dy / my.canvas.height;
        }
      }
    }
    my.drawAreas();
  }

  onChangeAngle(da/*radian*/){
    console.log(AreasEditorDiv2.TAG, "onChangeAngle", da);
    let my = this.client;
    for(let j = 0; j < my.areas.length; j++){
      let area = my.areas[j];
      if(area != null){
        let area_path = area.path;
        for(let i = 0; i < area_path.length; i++){
          console.log(AreasEditorDiv2.TAG, "onChangeAngle", area_path[i]);
          area_path[i].addAngle(new Point(0.5, 0.5), da);
        }
      }
    }
    my.drawAreas();
  }

  drawAreas(){
    super.drawAreas();
    if (this.mode == AreasEditorDiv2.MODE_TRANSFER) {
      console.log(this.transfer_handle);
      this.transfer_handle.draw(false);
    }
  }
}

customElements.define('areas-editor2', AreasEditorDiv2, {extends: 'div'});