import { keysDown } from "./input.js";
import { shuffle } from "./seedRandom.js";
export let autoMoveMode = false;
let autoInterval = null;
let autoYDirection = [false, false]; // [up, down]
let lastNoiseChange = 0

export function setAutomove(autoMove) {
  const changed = (autoMoveMode !== autoMove);
  autoMoveMode = autoMove;
  if (changed) {
    if (!autoMoveMode) {
      _intervalCleanup();
    } else {
      _intervalSetup();
    }
    console.log("Auto-move mode:", autoMoveMode);
  }
}

export function toggleAutomove() {
  setAutomove(!autoMoveMode);
}


function _intervalCleanup() {
    clearInterval(autoInterval);
    autoInterval = null;
    keysDown[RIGHT_ARROW] = false;
    keysDown[UP_ARROW] = false;
    keysDown[DOWN_ARROW] = false;
    document.getElementById('btnAuto').innerText = 'Auto';
    noLoop();
    redraw();
}


function _intervalSetup()  {
    if (!autoInterval) {
        autoInterval = setInterval(() => {
        // Simula pulsar flecha derecha
        keysDown[RIGHT_ARROW] = true;
        // Variación arriba/abajo
        if (Math.abs(noise(frameCount * 0.1) - lastNoiseChange) > 0.2) {
            autoYDirection = shuffle([[true, false], [false, true], [false, false]])[0]; // cambia dirección a veces
            lastNoiseChange = noise(frameCount * 0.1);
            //console.log("Auto-move Y direction changed to:", autoYDirection);
        }
        keysDown[UP_ARROW] = autoYDirection[0];
        keysDown[DOWN_ARROW] = autoYDirection[1];
        redraw(); // Asegura que el dibujo siga activo
        }, 100);
        document.getElementById('btnAuto').innerText = 'Stop Auto';
    } else {
        console.warn("autoInterval ja estava actiu");
    }
  }