import { logCursorPosition } from "./util.js";
import { zoomAt, pan } from './camera.js';

export function keyPressed() {
  if (key === 'q' || key === 'Q') {
    loop();     // empieza a repintar al pulsar Q
  }
  if (key === "1") {    logCursorPosition();  }
  // arrow keys for pan
  if (keyCode===LEFT_ARROW)  { pan(20,0); redraw();  }
  if (keyCode===RIGHT_ARROW) { pan(-20,0); redraw(); }
  if (keyCode===UP_ARROW)    { pan(0,20); redraw();  }
  if (keyCode===DOWN_ARROW)  { pan(0,-20); redraw(); }
}

export function keyReleased() {
  if (key === 'q' || key === 'Q') { 
    noLoop();                                  // vuelve a parar al soltar Q
    redraw();                                  // un último repintado
  }
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