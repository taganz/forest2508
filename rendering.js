
import { setCameraParameters, getCameraParameters, applyCamera, screenToWorldX, screenToWorldY } from "./camera.js";
import { bosque, debugShowBoundingBox } from "./main.js";
import { drawGridForForest, findTreeUnderMouse, drawTreeTooltip } from './util.js';
import {handleContinuousPan} from "./input.js";

let cnv;
export let showGrid = false; 
export function toggleGrid() {
    showGrid = !showGrid;
}

export function setupCanvas() {
  let canvasWidth = min(800, windowWidth);
  let canvasHeight = min(600, windowHeight);
  console.log(`canvas created: ${canvasWidth}x${canvasHeight}`);
  cnv = createCanvas(canvasWidth, canvasHeight);
  resetCanvas();
  return cnv;
}

export function resetCanvas() {
  clear();
  angleMode(RADIANS);
  rectMode(CORNER); 
  frameRate(12);
  setCameraParameters(0.4, width/2, height/2);
  noLoop();
  redraw();
}

export function draw() {

  clear();
  //background( "#e3e9d7" );  //248
  background( "#d6eac3" );  //248
  noStroke();

  applyCamera();

  _showGridIfNeeded();

  _drawVisibleForest();

  _showTooltipIfQPressed();

  handleContinuousPan();

}



export function windowResized() {
  let canvasWidth = min(800, windowWidth);
  let canvasHeight = min(600, windowHeight);
  console.log(`canvas resized: ${canvasWidth}x${canvasHeight}`);
  resizeCanvas(canvasWidth, canvasHeight);
  setCameraParameters(0.4, width/2, height/2);
}

function _drawVisibleForest() {
  const margin = 0.30; // 30% de tolerancia

  // Convierte esquinas a coordenadas de mundo
  let wx0 = screenToWorldX(0);
  let wy0 = screenToWorldY(0);
  let wx1 = screenToWorldX(width);
  let wy1 = screenToWorldY(height);
  if (debugShowBoundingBox) console.log('camara: ', getCameraParameters());
  if (debugShowBoundingBox) console.log(`World screen corners: (${wx0.toFixed(1)}, ${wy0.toFixed(1)}) to (${wx1.toFixed(1)}, ${wy1.toFixed(1)})`);

  // Calcula el margen extra
  const dx = Math.abs(wx1 - wx0) * margin;
  const dy = Math.abs(wy1 - wy0) * margin;

  // Aplica el margen
  const xmin = Math.min(wx0, wx1) - dx;
  const xmax = Math.max(wx0, wx1) + dx;
  const ymin = Math.min(wy0, wy1) - dy;
  const ymax = Math.max(wy0, wy1) + dy;

  if (debugShowBoundingBox)   console.log(`World to draw : (${xmin.toFixed(1)}, ${ymax.toFixed(1)} ) to (${xmax.toFixed(1)}, ${ymin.toFixed(1)})`);

  // Llama a bosque.drawGrid con los límites de la cámara
  bosque.drawGrid(xmin, xmax, ymin, ymax);
  
}

function _showTooltipIfQPressed () {
  if (keyIsDown(81) || keyIsDown(113)) { // 81 = 'Q', 113 = 'q'
    const hovered = findTreeUnderMouse(bosque);
    if (hovered) {
      drawTreeTooltip(hovered);
    }
  }
}

function _showGridIfNeeded() {
  if (showGrid) {
    drawGridForForest(bosque, 150, 150, 20);
  }
}