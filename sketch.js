/* Bosque genético con controles (p5.js) */
import { Forest } from './forest.js';
import { drawGridForForest, findTreeUnderMouse, drawTreeTooltip } from './util.js';
import { keyPressed, keyReleased, handleZoom, mouseMoved } from './input.js';
import { applyCamera, setCamera } from './camera.js';
import { screenToWorldX, screenToWorldY } from './camera.js';

let bosque;
let seedValue = Math.floor(Math.random()*1e9);

function setup() {
  let c = createCanvas(800, 600);
  //let c = createCanvas(windowWidth, windowHeight)
  c.parent('canvas-container');   // per a que surti dins del div
  c.position(0, document.getElementById('ui').offsetHeight + 18);  // que quedi per sota del botons
  c.elt.setAttribute('tabindex', '0'); // Permite que el canvas reciba foco
  c.elt.addEventListener('mouseenter', () => c.elt.focus());

  // Prevent page scroll on canvas wheel
  let cnv2 = document.querySelector('canvas');   // cnv es un p5.Element
  cnv2.addEventListener('wheel', handleZoom, { passive: false });

  angleMode(RADIANS);
  rectMode(CENTER);
  noLoop();

  // UI (simple DOM vanilla, sin p5.dom)
  const $ = sel => document.querySelector(sel);
  $('#seed').value = seedValue;
  $('#btnNewSeed').onclick = () => { seedValue = Math.floor(Math.random()*1e9); $('#seed').value = seedValue; };
  $('#btnApplySeed').onclick = () => { seedValue = parseInt($('#seed').value||0,10); reiniciar(); };
  $('#btnSpawnLast').onclick = () => { bosque.spawnLast(); redraw(); };
  $('#btnGrow1').onclick = () => { bosque.crecerPorGeneraciones(1); redraw(); };
  $('#btnGrow3').onclick = () => { bosque.crecerPorGeneraciones(3); redraw(); };
  $('#btnGrow1Pos').onclick = () => { bosque.crecerPorGeneracionesPosicion(1); redraw(); };
  $('#btnReset').onclick = reiniciar;
  $('#btnSave').onclick = () => saveCanvas('bosque_genetico','png');

  // atajos
  window.addEventListener('keydown', (e)=>{
    if(e.key==='g') { bosque.crecerPorGeneraciones(1); redraw(); }
    if(e.key==='s') { saveCanvas('bosque_genetico','png'); }
    if(e.key==='r') { reiniciar(); }
  });

  reiniciar();
}

function reiniciar() {
  randomSeed(seedValue);
  noiseSeed(seedValue);
  setCamera(0.4, width/2, height/2);
  bosque = new Forest();
  //bosque.firstTree(); 
  bosque.addTreeArea(15);
    
  // Crea exactamente dos hijos (derecha y abajo), tal como pides:
  //bosque.crearHijosPrimeros();
  // Si quieres que el bosque siga creciendo por generaciones, descomenta:
  //bosque.crecerPorGeneraciones(3); // p.ej. 3 generaciones
  redraw();
}

function draw() {
  clear();
  applyCamera();

  background(235);  //248
  noStroke();

  drawGridForForest(bosque, 150, 150, 20); // Dibuja una cuadrícula de fondo para referencia

  _drawVisibleForest();

  // Mostrar tooltip si Q está pulsada y el ratón está sobre un árbol
  if (keyIsDown(81) || keyIsDown(113)) { // 81 = 'Q', 113 = 'q'
    const hovered = findTreeUnderMouse(bosque);
    if (hovered) {
      drawTreeTooltip(hovered);
    }
  }
}

function _drawVisibleForest() {
  const margin = 0.10; // 10% de tolerancia

  // Esquinas del canvas en pantalla
  const x0 = 0, y0 = 0;
  const x1 = width, y1 = height;

  // Convierte a coordenadas de mundo
  let wx0 = screenToWorldX(x0);
  let wy0 = screenToWorldY(y0);
  let wx1 = screenToWorldX(x1);
  let wy1 = screenToWorldY(y1);

  // Calcula el margen extra
  const dx = Math.abs(wx1 - wx0) * margin;
  const dy = Math.abs(wy1 - wy0) * margin;

  // Aplica el margen
  const xmin = Math.min(wx0, wx1) - dx;
  const xmax = Math.max(wx0, wx1) + dx;
  const ymin = Math.min(wy0, wy1) - dy;
  const ymax = Math.max(wy0, wy1) + dy;

  // Llama a bosque.dibujar con los límites
  bosque.dibujar(xmin, xmax, ymin, ymax);
}


// Bind p5’s globals
// p5js espera trobar els callbacks en window i ho posem com modul no ho troba

window.setup        = setup;
window.draw         = draw;
//window.redraw       = redraw;
window.keyPressed   = keyPressed;
window.keyReleased  = keyReleased;
window.mouseMoved   = mouseMoved;

