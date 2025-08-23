/* Bosque genético con controles (p5.js) */
import { Forest } from './forest.js';
import { initInput, keyPressed, keyReleased, handleZoom, mouseMoved } from './input.js';
import { draw as p5draw, windowResized, setupCanvas }            from './rendering.js';

// --- simulation parameters --------------------

const initialForestSize = 14; // tamaño inicial del bosque como multiplicador de factor de separacion entre arboles (esta en forest de momento)
export const debugShowBoundingBox = false;
const treeDistance = 150;
const treePosXVariation = 0.3;
let seedValue = Math.floor(Math.random()*1e9);

//-------------------------------------------------

export let bosque;

function setup() {
  let c = setupCanvas();

  //let c = createCanvas(windowWidth, windowHeight)
  c.parent('canvas-container');   // per a que surti dins del div
  c.position(0, document.getElementById('ui').offsetHeight + 18);  // que quedi per sota del botons
  c.elt.setAttribute('tabindex', '0'); // Permite que el canvas reciba foco
  c.elt.addEventListener('mouseenter', () => c.elt.focus());

  // Prevent page scroll on canvas wheel
  let cnv2 = document.querySelector('canvas');   // cnv es un p5.Element
  cnv2.addEventListener('wheel', handleZoom, { passive: false });

  initInput(cnv2);

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

  bosque = new Forest(treeDistance, treePosXVariation);
  //bosque.firstTree(); 
  bosque.addTreeArea(initialForestSize);
    
  // Crea exactamente dos hijos (derecha y abajo), tal como pides:
  //bosque.crearHijosPrimeros();
  // Si quieres que el bosque siga creciendo por generaciones, descomenta:
  //bosque.crecerPorGeneraciones(3); // p.ej. 3 generaciones
  redraw();
}


// Bind p5’s globals
// p5js espera trobar els callbacks en window i ho posem com modul no ho troba
window.setup        = setup;
window.draw         = p5draw;
window.windowResized  = windowResized;
//window.redraw       = redraw;
window.keyPressed   = keyPressed;
window.keyReleased  = keyReleased;
window.mouseMoved   = mouseMoved;
