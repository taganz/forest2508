
import { setCamera, applyCamera, screenToWorldX, screenToWorldY } from "./camera.js";
import { bosque } from "./main.js";
import { drawGridForForest, findTreeUnderMouse, drawTreeTooltip } from './util.js';
import {handleContinuousPan} from "./input.js";

export let showGrid = false; 
export function toggleGrid() {
    showGrid = !showGrid;
}

export function setupCanvas() {
  angleMode(RADIANS);
  rectMode(CENTER);
  frameRate(10);
  noLoop();
  let c = _createCanvasAdaptedToWindow()
  return c;
}

export function draw() {
  clear();
  applyCamera();

  background(235);  //248
  noStroke();

  if (showGrid) {
    drawGridForForest(bosque, 150, 150, 20); // Dibuja la cuadrícula solo si showGrid es true
  }


  _drawVisibleForest();

  // Mostrar tooltip si Q está pulsada y el ratón está sobre un árbol
  if (keyIsDown(81) || keyIsDown(113)) { // 81 = 'Q', 113 = 'q'
    const hovered = findTreeUnderMouse(bosque);
    if (hovered) {
      drawTreeTooltip(hovered);
    }
  }

  handleContinuousPan();

}

function _createCanvasAdaptedToWindow() {
  let canvasWidth = min(800, windowWidth);
  let canvasHeight = min(600, windowHeight);
  console.log(`canvas created: ${canvasWidth}x${canvasHeight}`);
  let cnv = createCanvas(canvasWidth, canvasHeight);
  setCamera(0.4, width/2, height/2);
  return cnv;
}

export function windowResized() {
  let canvasWidth = min(800, windowWidth);
  let canvasHeight = min(600, windowHeight);
  console.log(`canvas resized: ${canvasWidth}x${canvasHeight}`);
  resizeCanvas(canvasWidth, canvasHeight);
  setCamera(0.4, width/2, height/2);
}

function _drawVisibleForest() {
  const margin = 0.10; // 10% de tolerancia

  // Convierte esquinas a coordenadas de mundo
  let wx0 = screenToWorldX(0);
  let wy0 = screenToWorldY(0);
  let wx1 = screenToWorldX(width);
  let wy1 = screenToWorldY(height);
  console.log(`World screen corners: (${wx0.toFixed(1)}, ${wy0.toFixed(1)}) to (${wx1.toFixed(1)}, ${wy1.toFixed(1)})`);

  // Calcula el margen extra
  const dx = Math.abs(wx1 - wx0) * margin;
  const dy = Math.abs(wy1 - wy0) * margin;

  // Aplica el margen
  const xmin = Math.min(wx0, wx1) - dx;
  const xmax = Math.max(wx0, wx1) + dx;
  const ymin = Math.min(wy0, wy1) - dy;
  const ymax = Math.max(wy0, wy1) + dy;

  console.log(`World to draw : (${xmin.toFixed(1)}, ${ymax.toFixed(1)} ) to (${xmax.toFixed(1)}, ${ymin.toFixed(1)})`);

  // Llama a bosque.dibujar con los límites1
  bosque.dibujar(xmin, xmax, ymin, ymax);
}

