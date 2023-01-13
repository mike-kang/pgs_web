//tranfer mode 지원.
class AreasTransferEditorCanvas extends AreasEditorBaseCanvas {
  static TAG = '[AreasTransferEditorCanvas]';

  constructor() {
      super();
      console.log(AreasTransferEditorCanvas.TAG, this);
  }

  connectedCallback() {
    console.log(AreasTransferEditorCanvas.TAG, 'connectedCallback()');
    super.connectedCallback();
    this.center = new Point(this.width / 2, this.height / 2)
    this.transfer_handle = new TranferHandle(this, this.center, this.onChangeAngle, this.onChangeMove, this);
  }
  
  onChangeMove(dx, dy){
    console.log(AreasTransferEditorCanvas.TAG, "onChangeMove", dx, dy);
    
    for(const id in this.areas){
      let area = this.areas[id];
      if(area){
        area.path.forEach(point => {
          point.x += dx / this.canvas.width;
          point.y += dy / this.canvas.height;
        });
      }
    }
    this.draw();
  }

  onChangeAngle(da/*radian*/){
    console.log(AreasTransferEditorCanvas.TAG, "onChangeAngle", da);
    for(const id in this.areas){
      let area = this.areas[id];
      if(area){
        area.path.forEach(point => {
          console.log(AreasTransferEditorCanvas.TAG, "onChangeAngle", point);
          point.addAngle(new Point(0.5, 0.5), da);
        });
      }
    }
    this.draw();
  }

  draw(){
    console.log(AreasTransferEditorCanvas.TAG, "draw");
    super.draw();
    this.transfer_handle.draw(this.transfer_handle, false);
  }
}

customElements.define('areas-transfer-editor-canvas', AreasTransferEditorCanvas, {extends: 'canvas'});