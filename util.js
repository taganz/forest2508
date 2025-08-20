import { screenToWorldX, screenToWorldY, worldToScreenX, worldToScreenY, viewOffsetX, viewOffsetY, viewScale } from './camera.js';

/*======================================*/
/**
 * Dibuja una cuadrícula que cubre el área donde hay árboles.
 * @param {Forest} forest - Tu objeto bosque con la lista `arboles`.
 * @param {number} stepX - separación entre líneas verticales (px).
 * @param {number} stepY - separación entre líneas horizontales (px).
 * @param {number} padding - margen extra alrededor del área (px).
 */

// treballa amb world coordinates
export function drawGridForForest(forest, stepX = 150, stepY = 150, padding = 20) {
  if (!forest || !forest.arboles || forest.arboles.length === 0) return;

  // 1) Calculamos el bounding box de TODOS los árboles (incluye copa y tronco)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  for (const t of forest.arboles) {
    const d = t.dna;

    // Anchura efectiva: copa manda (y un poco de tronco)
    const halfWidth = Math.max(d.crownWidth * 0.6, d.trunkWidth * 0.5);

    const left   = t.x - halfWidth;
    const right  = t.x + halfWidth;
    const top    = t.y - d.trunkHeight - d.crownHeight; // vértice superior de la copa
    const bottom = t.y;                                  // base del tronco

    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
    minY = Math.min(minY, top);
    maxY = Math.max(maxY, bottom);
  }

  //console.log(`minX ${minX} maxX ${maxX} minY ${minY} maxY ${maxY} `);
  //console.log(forest);

  // 2) Sin clamp a 0/width/height: permitimos negativos
  minX -= padding; maxX += padding;
  minY -= padding; maxY += padding;

  // 3) Ajustamos a múltiplos de la rejilla para que "encaje"
  const startX = Math.floor(minX / stepX) * stepX;
  const endX   = Math.ceil (maxX / stepX) * stepX;
  const startY = Math.floor(minY / stepY) * stepY;
  const endY   = Math.ceil (maxY / stepY) * stepY;

  // 4) Dibujo
  push();
  // color suave para que no distraiga (negro con alpha)
  stroke(0, 90);
  //stroke(0, 40);
  strokeWeight(1);

  // líneas verticales
  for (let x = startX; x <= endX; x += stepX) {
    line(x, startY, x, endY);
  }
  // líneas horizontales
  for (let y = startY; y <= endY; y += stepY) {
    line(startX, y, endX, y);
  }

  // (Opcional) ejes/etiquetas discretas cada 300 px    <---- SURTEN AL REVES PER EL SCALE -1 A LA Y
  // Arrays para almacenar etiquetas
  const etiquetasX = [];
  const etiquetasY = [];

  for (let wx = startX; wx <= endX; wx += 300) {
    const sx = worldToScreenX(wx) + 2;
    const sy = worldToScreenY(startY) + 12;
    etiquetasX.push({ sx, sy, valor: wx });

  }
  for (let wy = startY; wy <= endY; wy += 300) {
    const sx = worldToScreenX(startX) + 3;
    const sy = worldToScreenY(wy) - 3;
    etiquetasY.push({ sx, sy, valor: wy });
  }
  push();
  resetMatrix();
  fill(0, 100); noStroke(); textSize(10);
  for (const e of etiquetasX) {
    text(e.valor, e.sx, e.sy);
  }
  for (const e of etiquetasY) {
    text(e.valor, e.sx, e.sy);
  }
  pop();

  pop();
}



// --- Utils ---
function colorToHex(c) {
  // c es p5.Color
  const r = nf(red(c),   2, 0);
  const g = nf(green(c), 2, 0);
  const b = nf(blue(c),  2, 0);
  // nf no rellena con 0 en hex, así que usamos toString(16) manual:
  const rh = ('0' + int(r).toString(16)).slice(-2);
  const gh = ('0' + int(g).toString(16)).slice(-2);
  const bh = ('0' + int(b).toString(16)).slice(-2);
  return `#${rh}${gh}${bh}`.toUpperCase();
}

function treeBounds(t) {
  // world coordinates
  const d = t.dna;
  const halfW = Math.max(d.crownWidth * 0.6, d.trunkWidth * 0.5);
  const left   = t.x - halfW;
  const right  = t.x + halfW;
  const top    = t.y + d.trunkHeight + d.crownHeight;  // world coordinates
  const bottom = t.y;
  return { left, right, top, bottom };
}

function treeHit(t, wx, wy) {
  // world coordinates
  const b = treeBounds(t);
  return wx >= b.left && wx <= b.right && wy <= b.top && wy >= b.bottom;
}

export function findTreeUnderMouse(forest) {
  if (!forest || !forest.arboles) { console.log("No hay árboles en el bosque."); return null;}
  // Convertir mouseX, mouseY (pantalla) a coordenadas del mundo
  const mx = screenToWorldX(mouseX);
  const my = screenToWorldY(mouseY);
  //console.log(`Buscando árbol bajo el ratón en mouse (${mouseX}, ${mouseY}) world (${mx}, ${my})`);
  // Recorremos al revés para priorizar árboles “encima” si los dibujas en orden
  for (let i = forest.arboles.length - 1; i >= 0; i--) {
    const t = forest.arboles[i];
    if (treeHit(t, mx, my)) { 
      //console.log(`Árbol encontrado: ${t.dna.crownShape} en (${t.x}, ${t.y})`);
      return t;
    }
  }
  return null;
}

export function drawTreeTooltip(t) {
  const d = t.dna;
  // Prepara líneas de texto
  const lines = [
    `pos: (${int(t.x)}, ${int(t.y)})`,
    `crownShape: ${d.crownShape}`,
    `crownW/H : ${int(d.crownWidth)} / ${int(d.crownHeight)}`,
    `crownColor: ${colorToHex(d.crownColor)}`,
    `trunkType : ${d.trunkType}`,
    `trunkW/H  : ${int(d.trunkWidth)} / ${int(d.trunkHeight)}`,
    `trunkColor: ${colorToHex(d.trunkColor)}`,
    `spaceNeed : ${int(d.spaceNeeded)}`
  ];

  // Medidas del tooltip
  push();
  resetMatrix(); // <-- Asegura que el tooltip se dibuja en coordenadas de pantalla
  textFont('monospace');
  textSize(12);
  const pad = 8;
  let w = 0;
  for (const line of lines) w = Math.max(w, textWidth(line));
  const h = lines.length * 16; // 12px + interlineado

  // Usa el tamaño real del canvas
  let canvasW = drawingContext.canvas.width;
  let canvasH = drawingContext.canvas.height;

  // Posición cerca del ratón con “ajuste” para no salir del canvas
  let x = mouseX + 14;
  let y = mouseY + 14;
  if (x + w + pad * 2 > canvasW)  x = canvasW  - w - pad * 2;
  if (y + h + pad * 2 > canvasH) y = canvasH - h - pad * 2;

  // Fondo y borde
  noStroke();
  rectMode(CORNER);
  fill(255, 230); // blanco con algo de transparencia
  rect(x, y, w + pad * 2, h + pad * 2, 8);
  stroke(0, 60);
  noFill();
  rect(x, y, w + pad * 2, h + pad * 2, 8);

  // Texto
  fill(20);
  noStroke();
  let ty = y + pad + 12;
  for (const line of lines) {
    text(line, x + pad, ty);
    ty += 16;
  }
  pop();
}


export function logCursorPosition() {
  console.log("---------------------------");
  //let worldMinX, worldMaxX;
  //({ worldMinX, worldMaxX } = getWorldXBounds());
  //console.log(`World bounds: ${worldMinX.toFixed(1)}, ${worldMaxX.toFixed(1)}`);
  //console.log("World bounds to screen:", worldToScreenX(worldMinX).toFixed(1), worldToScreenX(worldMaxX).toFixed(1));
  console.log(`Cursor position: (${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`);
  console.log(`World position: (${screenToWorldX(mouseX).toFixed(1)}, ${screenToWorldY(mouseY).toFixed(1)})`);
  console.log(`Camera scale: ${viewScale.toFixed(1)}`);
  console.log(`Camera offset: (${viewOffsetX.toFixed(1)}, ${viewOffsetY.toFixed(1)})`);
}