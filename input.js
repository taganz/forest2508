import { logCursorPosition } from "./util.js";
import { zoomAt, pan } from './camera.js';
import { toggleGrid } from "./rendering.js";
import { setupMobileInput } from './inputMobile.js';
import { setDrawTreeBase } from "./tree.js";

export const keysDown = {}
const panStep = 5;
export let isMobile = false;

export function initInput(canvas) {

  // Detect if we are on a mobile device
  const isMobile = _isMobileDevice();
  if (isMobile) {
    console.log("Mobile device detected, enabling touch input.");
    if (typeof setupMobileInput === 'function') {
      setupMobileInput(canvas);
    }
  } else {
    console.log("Desktop device detected, using mouse input.");
  }
}

function _isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function keyPressed() {
  keysDown[keyCode] = true;

  if (key === 'q' || key === 'Q') {
    loop();     // empieza a repintar al pulsar Q
  }
  if (key === "1") {    logCursorPosition();  }
  if (key === "2") {    setDrawTreeBase();  }
  // arrow keys for pan
  if (keyCode===LEFT_ARROW)  { pan(panStep,0); loop();  }   // loop en comptes de redraw per a permetre continuous pan
  if (keyCode===RIGHT_ARROW) { pan(-panStep,0); loop(); }
  if (keyCode===UP_ARROW)    { pan(0,panStep); loop();  }
  if (keyCode===DOWN_ARROW)  { pan(0,-panStep); loop(); }
  if (key === 'g' || key === 'G') { toggleGrid(); redraw(); }
  //if(e.key==='s') { saveCanvas('bosque_genetico','png'); }
   //if(e.key==='r') { reiniciar(); }
   
}

export function keyReleased() {
  //keysDown[keyCode] = false;

  if (key === 'q' || key === 'Q') { 
    noLoop();                                  // vuelve a parar al soltar Q
    redraw();                                  // un último repintado
  }

  // pot ser que si s'aixequen dues tecles al mateix temps nomes es cridi la funcio un cop?
  // revisem que estan totes be
  if (!keyIsDown(LEFT_ARROW)) {keysDown[LEFT_ARROW] = false;};
  if (!keyIsDown(RIGHT_ARROW)) {keysDown[RIGHT_ARROW] = false};
  if (!keyIsDown(UP_ARROW)) {keysDown[UP_ARROW] = false};
  if (!keyIsDown(DOWN_ARROW)) {keysDown[DOWN_ARROW] = false};

  let someKeyStillPressed = false;
  [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].every(code => someKeyStillPressed = someKeyStillPressed  || keysDown[code]);
  // --> OJO es desactiva el pan encara que hi hagi encara una tecla apretada
  if (!someKeyStillPressed) {
          noLoop(); 
          redraw();
  }   // loop en comptes de redraw per a permetre continuous pan
}

export function mouseMoved() {
  if (keyIsDown(81) || keyIsDown(113) ) redraw();                 // repinta al mover el ratón con Q
}

export function handleZoom(event) {

  //if (inputMode == 'touch') return;
  //console.log("wheel event deltaY:", event.deltaY);

  // 1) stop the page from scrolling if the user scrolls over the canvas
  event.preventDefault();

  // 2) pick a zoom factor
  //const sensitivity = 0.01;
  //const zoomFactor = 1 - event.delta * sensitivity;
  const zoomFactor = event.deltaY < 0 ? 1.03 : 0.97;

  // 3) apply it around the mouse cursor
  //zoomAt(event.clientX, event.clientY, zoomFactor);  can not use event coordinates
  zoomAt(mouseX, mouseY, zoomFactor);
 
  // 4) redraw the sketch
  redraw();
  
  // 5) signal we handled it
  return false;
}

export function handleContinuousPan() {
  if (keysDown[LEFT_ARROW])  pan(panStep, 0);
  if (keysDown[RIGHT_ARROW]) pan(-panStep, 0);
  if (keysDown[UP_ARROW])    pan(0, panStep);
  if (keysDown[DOWN_ARROW])  pan(0, -panStep)    

}