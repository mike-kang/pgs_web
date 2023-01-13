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
  
  onChangeMove(self, dx, dy){
    console.log(AreasTransferEditorCanvas.TAG, "onChangeMove", dx, dy);
    
    for(const id in self.areas){
      let area = self.areas[id];
      if(area){
        area.path.forEach(point => {
          point.x += dx / self.width;
          point.y += dy / self.height;
        });
      }
    }
    self.draw();
  }

  onChangeAngle(self, da/*radian*/){
    console.log(AreasTransferEditorCanvas.TAG, "onChangeAngle", da);
    for(const id in self.areas){
      let area = self.areas[id];
      if(area){
        area.path.forEach(point => {
          console.log(AreasTransferEditorCanvas.TAG, "onChangeAngle", point);
          point.addAngle(new Point(0.5, 0.5), da);
        });
      }
    }
    self.draw();
  }

  draw(){
    console.log(AreasTransferEditorCanvas.TAG, "draw");
    super.draw();
    this.transfer_handle.draw(false);
  }
}

customElements.define('areas-transfer-editor-canvas', AreasTransferEditorCanvas, {extends: 'canvas'});