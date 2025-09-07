/* Bosque genético con controles (p5.js) */
import { Forest } from './forest.js';
import { initInput, keyPressed, keyReleased, handleZoom, mouseMoved } from './input.js';
import { draw as p5draw, windowResized, setupCanvas, resetCanvas }            from './rendering.js';
import { createZoneSystem } from './biomes.js';
import { dnaFromPosition, initDNA } from './DNA.js';
import { random, randomize } from './seedRandom.js';
import { toggleAutomove } from './automove.js';

// --- simulation parameters --------------------

export const debugShowBoundingBox = false;
const treeDistance = 150;  // 150
const treePosXVariation = 0.2;  
export let seedValue = Math.floor(Math.random()*1e9);
let frameRateVal = 60;
const zonesDefault = [
    { id: '1',     max: 0.40, color: '#3a6ea5', treeHeightFactor: 1.0, treeWidthFactor: 1.1 },
    { id: '2',      max: 0.34, color: '#7fbbe3', treeHeightFactor: 1.1, treeWidthFactor: 1.3 },
    { id: '3',    max: 0.60, color: '#77c56b', treeHeightFactor: 1.2, treeWidthFactor: 1.2 },
    { id: '4',     max: 0.68, color: '#2e8b57', treeHeightFactor: 1.24, treeWidthFactor: 1.24 },
    { id: '5',      max: 0.75, color: '#188c4f', treeHeightFactor: 1.27, treeWidthFactor: 1.27 },
    { id: '6',    max: 0.92, color: '#8a7f7a', treeHeightFactor: 1.30, treeWidthFactor: 1 },
    { id: '7',      max: 1.01, color: '#f0f4f7', treeHeightFactor: 1.35, treeWidthFactor: 0.9 }
  ]

//-------------------------------------------------

export let bosque;
export let zoneSystem;

function setup() {
  let c = setupCanvas(frameRateVal);

  c.parent('canvas-container');   // per a que surti dins del div
  const uiOffset = document.getElementById('ui').offsetHeight + 18;
  c.position((windowWidth - c.width) / 2, uiOffset);
  c.elt.setAttribute('tabindex', '0'); // Permite que el canvas reciba foco
  c.elt.addEventListener('mouseenter', () => c.elt.focus());

  // Prevent page scroll on canvas wheel
  let cnv2 = document.querySelector('canvas');   // cnv es un p5.Element
  cnv2.addEventListener('wheel', handleZoom, { passive: false });

  initInput(cnv2);


  // UI (simple DOM vanilla, sin p5.dom)
  const $ = sel => document.querySelector(sel);
  $('#seed').value = seedValue;
  $('#btnNewSeed').onclick = () => {
    seedValue = Math.floor(Math.random()*1e9);
    $('#seed').value = seedValue;
    reiniciar();
  };
   $('#btnApplySeed').onclick = () => { seedValue = parseInt($('#seed').value||0,10); reiniciar(); };
  $('#btnReset').onclick = () => reiniciar();
  $('#btnSave').onclick = () => saveCanvas('bosque_genetico','png');
  $('#btnAuto').onclick = () => toggleAutomove();

  // atajos
  window.addEventListener('keydown', (e)=>{
    if(e.key==='g') { bosque.crecerPorGeneraciones(1); redraw(); }
    if(e.key==='s') { saveCanvas('bosque_genetico','png'); }
    if(e.key==='r') { reiniciar(); }
  });

  reiniciar();
  console.log("zoneSystem.getZone(0, 0), amb fields:", zoneSystem.getZone(0, 0));
  console.log("tree at 0,0 DNA:", dnaFromPosition(0, 0, treeDistance, treePosXVariation));
}

function reiniciar() {
  console.log("Reiniciando con semilla:", seedValue);
  randomize(seedValue);
  noiseSeed(seedValue);
  initDNA();
  zoneSystem = initZoneSystem(seedValue);
  bosque = new Forest(treeDistance, treePosXVariation);
  resetCanvas();
}

function initZoneSystem () {
  const zoneSystemParams = {
  seed: 20250828,     
	// escala global del mapa (cuanto menor, más grandes los parches)
  baseFreq: 0.001, // 0.002, // mas pequeño zonas mas grandes
	// parámetros fBM del “campo de zonas”
  zoneNoise: { octaves: 5, lacunarity: 2.0, gain: 0.5 },
	// warping para dar formas orgánicas
  warp:  { seed: 777, freq: 0.0015, amp: 120, octaves: 3 },
	// campos adicionales (altura/temperatura/humedad) para enriquecer bioma
  elevNoise: { seed: 11, octaves: 5, freq: 0.0018 },
  tempNoise: { seed: 23, octaves: 4, freq: 0.0009 },
  moistNoise: { seed: 31, octaves: 4, freq: 0.0012 },
  // tabla de zonas del campo principal
    zones: zonesDefault
	} 
	 const zs = createZoneSystem(zoneSystemParams);
   console.log("Zone system.config:", zs.config);
   return zs;
 }

// Bind p5’s globals
// p5js espera trobar els callbacks en window i si ho posem dins de moduls no ho troba alla
window.setup        = setup;
window.draw         = p5draw;
window.windowResized  = windowResized;
//window.redraw       = redraw;
window.keyPressed   = keyPressed;
window.keyReleased  = keyReleased;
window.mouseMoved   = mouseMoved;

