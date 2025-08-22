const expect  = chai.expect

import {
  setCameraParameters,
  resetCamera,
  applyCamera,
  screenToWorldX,
  screenToWorldY,
  worldToScreenX,
  worldToScreenY,
  pan,
  zoomAt,
  viewScale,
  viewOffsetX,
  viewOffsetY
} from '../camera.js';

// Mock global variables used in camera.js
// en entorn execucio node es pot fer servir global, en entorn navegador cal windows
window.height = 600;

describe('camera.js', () => {
  beforeEach(() => {
    resetCamera();
  });

  it('setCameraParameters sets scale and offsets', () => {
    setCameraParameters(2, 100, 200);
    expect(viewScale).to.equal(2);
    expect(viewOffsetX).to.equal(100);
    expect(viewOffsetY).to.equal(200);
  });

  it('worldToScreenX works', () => {
    setCameraParameters(0.4, 400, 300);
    expect(worldToScreenX(0)).to.equal(400);
    expect(worldToScreenX(-1000)).to.equal(0);
    expect(worldToScreenX(1000)).to.equal(800);
    
  });
  it('worldToScreenY works', () => {
    setCameraParameters(0.4, 400, 300);
    expect(worldToScreenY(0)).to.equal(300);
    expect(worldToScreenY(750)).to.equal(0);
    expect(worldToScreenY(-750)).to.equal(600);
    
  });

  it('screenToWorldX works', () => {
    setCameraParameters(0.4, 400, 300);
    expect(screenToWorldX(0)).to.equal(-1000);
    expect(screenToWorldX(400)).to.equal(0);
    expect(screenToWorldX(600)).to.equal(500);
    expect(screenToWorldX(800)).to.equal(1000);
    
  });
  it('screenToWorldY works', () => {
    setCameraParameters(0.4, 400, 300);
    expect(screenToWorldY(0)).to.equal(750);
    expect(screenToWorldY(300)).to.equal(0);
    expect(screenToWorldY(400)).to.equal(-250);
    expect(screenToWorldY(600)).to.equal(-750);
  });
  it ('screenToWorldY - 1,0,0 es com si hi hagues origen abaix a l\'esquerra', () => {
    setCameraParameters(1, 0, 0);
    expect(screenToWorldY(0)).to.equal(600);
    expect(screenToWorldY(300)).to.equal(300);
    expect(screenToWorldY(600)).to.equal(0);
  });
  it('screenToWorldX and worldToScreenX are inverses', () => {
    setCameraParameters(2, 100, 0);
    const wx = 300;
    // ojo, si es fa la comparacio al reves pot sortir malament per snap to grid
    const sx = worldToScreenX(wx);
    expect(screenToWorldX(sx)).to.be.closeTo(wx, 0.0001);
  });

  it('screenToWorldY and worldToScreenY are inverses', () => {
    setCameraParameters(0.4, 0, 300);
    const wy = 750;
    // ojo, si es fa la comparacio al reves pot sortir malament per snap to grid
    const sy = worldToScreenY(wy);
    expect(sy).to.be.closeTo(0, 0.0001);
    expect(screenToWorldY(sy)).to.be.closeTo(wy, 0.0001);
  });

  it('pan moves the camera', () => {
    setCameraParameters(1, 0, 0);
    pan(10, 20);
    expect(viewOffsetX).to.equal(10);
    expect(viewOffsetY).to.equal(20);
  });

    //
    //  -- ojo aquest es va fer per jengax, cal revisar
    //
  it.skip('zoomAt changes scale and offset', () => {
    setCameraParameters(1, 0, 0);
    zoomAt(100, 200, 2);
    expect(viewScale).to.equal(2);
    expect(viewOffsetX).to.equal(100);
  });
});