/* Bosque genético con controles (p5.js) */
import { Forest } from './forest.js';
import { drawGridForForest, findTreeUnderMouse, drawTreeTooltip } from './util.js';
import { keyPressed, keyReleased, mouseMoved } from './ui.js';

let bosque;
let seedValue = Math.floor(Math.random()*1e9);

function setup() {
  //createCanvas(900, 600);
  createCanvas(windowWidth, windowHeight)
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
  bosque = new Forest();
  //bosque.firstTree(); 
  bosque.addTreeArea(5);
    
  // Crea exactamente dos hijos (derecha y abajo), tal como pides:
  //bosque.crearHijosPrimeros();
  // Si quieres que el bosque siga creciendo por generaciones, descomenta:
  //bosque.crecerPorGeneraciones(3); // p.ej. 3 generaciones
  redraw();
}

function draw() {
  clear();
  translate(width / 2, height / 2);
  scale(0.4, 0.4);
  background(248);
  noStroke();
  drawGridForForest(bosque, 150, 150, 20); // Dibuja una cuadrícula de fondo para referencia
  bosque.dibujar();


  // Mostrar tooltip si Q está pulsada y el ratón está sobre un árbol
  if (keyIsDown(81) || keyIsDown(113)) { // 81 = 'Q', 113 = 'q'
    const hovered = findTreeUnderMouse(bosque);
    if (hovered) {
      drawTreeTooltip(hovered);
    }
  }
}


// Bind p5’s globals
// p5js espera trobar els callbacks en window i ho posem com modul no ho troba

window.setup        = setup;
window.draw         = draw;
//window.redraw       = redraw;
window.keyPressed   = keyPressed;
window.keyReleased  = keyReleased;
window.mouseMoved   = mouseMoved;

