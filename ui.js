import { logCursorPosition } from "./util.js";

export function keyPressed() {
  if (key === 'q' || key === 'Q') {
    loop();     // empieza a repintar al pulsar Q
  }
  if (key === "1") {
    logCursorPosition();
  }
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