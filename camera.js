/* ========================================

camera.js

Este módulo gestiona la "cámara" virtual para zoom y pan

Uso
- Inicializar con setCameraParameters()
- En draw() usar applyCamera()  para aplicar la transformacion

Util
- zoomAt(mouseX, mouseY, zoomFactor) - Hace zoom en torno a un punto de la pantalla, ajustando el desplazamiento y la escala para que el punto bajo el ratón permanezca fijo.
- pan(dx, dy) - Desplaza la cámara en X e Y.
- Convertir coordenadas pantalla (canvas) y mundo.
      screenToWorldX(sx), screenToWorldY(sy) qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
      worldToScreenX(wx), worldToScreenY(wy)
- snapToGrid


========================================= */



export const snapToGrid = false;   // <-- CAL REVISAR
export const grid_width = 20; // Ancho de la cuadrícula  --- falta funcion para fijar

export let viewScale;
export let viewOffsetX;
export let viewOffsetY;


export function resetCamera() {
  viewScale = 1;
  viewOffsetX = 0; 
  viewOffsetY = 0; 

}

export function setCameraParameters(scale, offsetX, offsetY) {
  viewScale = scale;
  viewOffsetX = offsetX;
  viewOffsetY = offsetY;
} 

export function getCameraParameters() {
  return {
    viewScale: viewScale,
    viewOffsetX: viewOffsetX,
    viewOffsetY: viewOffsetY
  };
}

export function applyCamera() {
  translate(viewOffsetX, viewOffsetY);
  scale(viewScale, - viewScale);
  
}


export function screenToWorldX(sx) {
  let wx = (sx - viewOffsetX) / viewScale;
   if (snapToGrid) {
      wx = Math.round(wx / grid_width) * grid_width;
    }
  return wx;
}

export function screenToWorldY(sy) {
  // Primero, revertimos el offset y el escalado
  // El height es necesario porque el origen Y cambia con el escalado negativo
  let wy = (-sy - viewOffsetY + height) / viewScale;
  if (snapToGrid) {
    wy = Math.round(wy / grid_width) * grid_width;
  }
  return wy;
}

export function worldToScreenX(wx) {
  return wx * viewScale + viewOffsetX;
}
export function worldToScreenY(wy) {
  return height - viewOffsetY - wy * viewScale;
}


//
//  -- ojo aquest es va fer per jengax, cal revisar
//
export function zoomAt(mouseX, mouseY, zoomFactor) {
  // veure demo https://openprocessing.org/sketch/2680897
  viewOffsetX = mouseX + (viewOffsetX - mouseX) * zoomFactor;
  viewScale *= zoomFactor;
  
}

export function pan(dx, dy) {
  viewOffsetX += dx;
  viewOffsetY += dy;
}

// Hacer pan accesible globalmente para inputMobile.js
if (typeof window !== 'undefined') {
  window.pan = pan;
}

