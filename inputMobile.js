// inputMobile.js
// Soporte para eventos táctiles en móviles para mover el cursor

let touchX = 0;
let touchY = 0;


// El segundo argumento (onMove) es opcional, si se pasa se llama además del pan
export function setupMobileInput(canvas, onMove) {
  let lastTouch = null;
  const panStep = 20;
  const threshold = 30; // píxeles mínimos para considerar un swipe

  canvas.addEventListener('touchstart', function(evt) {
    if (evt.touches && evt.touches.length > 0) {
      lastTouch = {
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY
      };
      if (typeof onMove === 'function') {
        onMove(lastTouch.x, lastTouch.y);
      }
    }
  }, false);

  canvas.addEventListener('touchmove', function(evt) {
    evt.preventDefault();
    if (evt.touches && evt.touches.length > 0 && lastTouch) {
      const x = evt.touches[0].clientX;
      const y = evt.touches[0].clientY;
      const dx = x - lastTouch.x;
      const dy = y - lastTouch.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > threshold) {
          if (window.pan) window.pan(-panStep, 0); // derecha
          lastTouch = {x, y};
        } else if (dx < -threshold) {
          if (window.pan) window.pan(panStep, 0); // izquierda
          lastTouch = {x, y};
        }
      } else {
        if (dy > threshold) {
          if (window.pan) window.pan(0, -panStep); // abajo
          lastTouch = {x, y};
        } else if (dy < -threshold) {
          if (window.pan) window.pan(0, panStep); // arriba
          lastTouch = {x, y};
        }
      }
      if (typeof onMove === 'function') {
        onMove(x, y);
            // <---- PER FUTURS USOS
      }
      if (window.loop) window.loop();
    }
  }, false);
}

