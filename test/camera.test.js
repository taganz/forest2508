const expect  = chai.expect

import {
  setCamera,
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

  it('setCamera sets scale and offsets', () => {
    setCamera(2, 100, 200);
    expect(viewScale).to.equal(2);
    expect(viewOffsetX).to.equal(100);
    expect(viewOffsetY).to.equal(200);
  });

  it('worldToScreenX works', () => {
    setCamera(0.4, 400, 300);
    expect(worldToScreenX(0)).to.equal(400);
    expect(worldToScreenX(-1000)).to.equal(0);
    expect(worldToScreenX(1000)).to.equal(800);
    
  });
  it('worldToScreenY works', () => {
    setCamera(0.4, 400, 300);
    expect(worldToScreenY(0)).to.equal(300);
    expect(worldToScreenY(750)).to.equal(0);
    expect(worldToScreenY(-750)).to.equal(600);
    
  });

  it('screenToWorldX and worldToScreenX are inverses', () => {
    setCamera(2, 100, 0);
    const wx = 300;
    // ojo, si es fa la comparacio al reves pot sortir malament per snap to grid
    const sx = worldToScreenX(wx);
    expect(screenToWorldX(sx)).to.be.closeTo(wx, 0.0001);
  });

  it('screenToWorldY and worldToScreenY are inverses', () => {
    setCamera(0.4, 0, 300);
    const wy = 750;
    // ojo, si es fa la comparacio al reves pot sortir malament per snap to grid
    const sy = worldToScreenY(wy);
    expect(sy).to.be.closeTo(0, 0.0001);
    expect(screenToWorldY(sy)).to.be.closeTo(wy, 0.0001);
  });

  it('pan moves the camera', () => {
    setCamera(1, 0, 0);
    pan(10, 20);
    expect(viewOffsetX).to.equal(10);
    expect(viewOffsetY).to.equal(20);
  });

    //
    //  -- ojo aquest es va fer per jengax, cal revisar
    //
  it('zoomAt changes scale and offset', () => {
    setCamera(1, 0, 0);
    zoomAt(100, 200, 2);
    expect(viewScale).to.equal(2);
    expect(viewOffsetX).to.equal(100);
  });
});