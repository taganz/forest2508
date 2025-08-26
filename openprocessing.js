const snapToGrid = false;   
const grid_width = 20; 
let viewScale;
let viewOffsetX;
let viewOffsetY;
function resetCamera() {
  viewScale = 1;
  viewOffsetX = 0; 
  viewOffsetY = 0; 
}
function setCameraParameters(scale, offsetX, offsetY) {
  viewScale = scale;
  viewOffsetX = offsetX;
  viewOffsetY = offsetY;
} 
function getCameraParameters() {
  return {
    viewScale: viewScale,
    viewOffsetX: viewOffsetX,
    viewOffsetY: viewOffsetY
  };
}
function applyCamera() {
  translate(viewOffsetX, viewOffsetY);
  scale(viewScale, - viewScale);
}
function screenToWorldX(sx) {
  let wx = (sx - viewOffsetX) / viewScale;
   if (snapToGrid) {
      wx = Math.round(wx / grid_width) * grid_width;
    }
  return wx;
}
function screenToWorldY(sy) {
  let wy = (viewOffsetY - sy) / viewScale;
  if (snapToGrid) {
    wy = Math.round(wy / grid_width) * grid_width;
  }
  return wy;
}
function worldToScreenX(wx) {
  return wx * viewScale + viewOffsetX;
}
function worldToScreenY(wy) {
  return viewOffsetY - wy * viewScale;
}
function zoomAt(mouseX, mouseY, zoomFactor) {
  viewOffsetX = mouseX + (viewOffsetX - mouseX) * zoomFactor;
  viewScale *= zoomFactor;
}
function pan(dx, dy) {
  viewOffsetX += dx;
  viewOffsetY += dy;
}
if (typeof window !== 'undefined') {
  window.pan = pan;
}
const paletaVerdes = [
    '#6FBF73' 
    ,'#C9E265' 
    ,'#81C784'
    ,'#2E7D32' 
    ,'#4CAF50'
    ,'#A5D6A7'
    ,'#B7D84B'  
];
const paletaMarron = [
    '#7B4B21', '#8D5524',
    '#A97142', '#5D3A1A'
];
const formas = ['triangulo', 'circulo', 'elipse'];
const cwA1 = 40 + 40 * Math.random();
const cwA2 = 40 + 40 * Math.random();
const cwTx = 200 + 1100 * Math.random();
const cwFx = Math.PI/2 * Math.random();
const cwTy = 200 + 1200 * Math.random();
const cwFy = Math.PI/2 * Math.random();
const chA1 = 20 + 100 * Math.random();
const chA2 = 20 + 60 * Math.random();
const chTx = 100 + 200 * Math.random();
const chFx = Math.PI/2 * Math.random();
const chTy = 200 + 400 * Math.random();
const chFy = Math.PI/2 * Math.random();
class DNA {
    constructor({ crownShape, crownHeight, crownWidth, crownColor, trunkType, trunkHeight, trunkWidth, trunkColor, spaceNeeded }) {
        this.crownShape = crownShape;
        this.crownHeight = crownHeight;
        this.crownWidth = crownWidth;
        this.crownColor = crownColor;
        this.trunkType = trunkType;
        this.trunkHeight = trunkHeight;
        this.trunkWidth = trunkWidth;
        this.trunkColor = trunkColor;
        this.spaceNeeded = spaceNeeded;
    }
    static aleatorio() {
        const crownWidth = random(28, 80);
        const crownHeight = random(30, 120);
        const trunkWidth = random(4, 14);
        const trunkHeight = random(30, 90);
        const spaceNeeded = max(60, crownWidth * 1.2, trunkHeight * 0.9);
        return new DNA({
            crownShape: random(formas),
            crownHeight, crownWidth,
            crownColor: random(paletaVerdes),
            trunkType: random(['linea', 'lineaRamas']),
            trunkHeight, trunkWidth,
            trunkColor: random(paletaMarron),
            spaceNeeded
        });
    }
    static dnaPosition(x, y) {            
        const idx = Math.min(formas.length - 1, Math.floor(formas.length * 0.7 * noise((x+10)/700, (y+35)/1200)));
        const crownShape = formas[idx];
        const crownWidth = 40 + noise(x/300, y/300) * 150;
        const crownHeight = 30 + noise((x+50)/400, (y+50)/30) * 150;
        const idxColor = Math.min(paletaVerdes.length - 1, Math.floor(paletaVerdes.length * noise(x/1500, (y+500)/1800)));
        const crownColor = paletaVerdes[idxColor];
        const trunkType = random(['linea', 'lineaRamas']);
        const trunkWidth = 10; 
        const trunkHeight = 45; 
        const trunkColor = random(paletaMarron);
        const spaceNeeded = Math.max(60, crownWidth * 1.2, trunkHeight * 0.9);
        return new DNA({
            crownShape : crownShape
            , crownWidth : crownWidth  
            , crownHeight : crownHeight 
            , crownColor : crownColor
            , trunkType : trunkType
            , trunkHeight : trunkHeight
            , trunkWidth : trunkWidth
            , trunkColor : trunkColor
            , spaceNeeded : spaceNeeded
        });
    }
    mutado10() {
        const nd = new DNA({ ...this });
        const cont = ['crownHeight', 'crownWidth', 'trunkHeight', 'trunkWidth', 'spaceNeeded'];
        const disc = ['crownShape', 'trunkType', 'crownColor', 'trunkColor'];
        if (random() < 0.65) {
            const k = random(cont);
            const factor = 1 + random([-0.1, 0.1]); 
            nd[k] = max(1, this[k] * factor);
            if (k === 'crownWidth' || k === 'trunkHeight') {
                nd.spaceNeeded = max(60, nd.crownWidth * 1.2, nd.trunkHeight * 0.9);
            }
        } else {
            const k = random(disc);
            if (k === 'crownShape') {
                nd.crownShape = random(formas.filter(f => f !== this.crownShape));
            } else if (k === 'trunkType') {
                nd.trunkType = this.trunkType === 'linea' ? 'lineaRamas' : 'linea';
            } else if (k === 'crownColor') {
                nd.crownColor = random(paletaVerdes);
            } else if (k === 'trunkColor') {
                nd.trunkColor = random(paletaMarron);
            }
        }
        return nd;
    }
}
class Tree {
    constructor(wx, wy, dna) { 
        this.x = wx; 
        this.y = wy; 
        if (dna == null) {
            this.dna = DNA.aleatorio();
        } else {
            this.dna = dna;
        }
    }
    hijoDNA() { 
        return this.dna.mutado10();
     }
    boundingBox() {
        const d = this.dna;
        const x1 = this.x - d.crownWidth / 2;
        const x2 = this.x + d.crownWidth / 2;
        const y1 = this.y;
        const y2 = this.y + d.trunkHeight + d.crownHeight;
        return { x1, y1, x2, y2 };
    }
    draw() { 
        const d = this.dna;
        const x = this.x;
        const y = this.y;
        if (debugShowBoundingBox) {
            const bb = this.boundingBox();
            push(); stroke('red');strokeWeight(54); point(x, y); pop();
            push(); stroke('red');strokeWeight(5); noFill(); rect(bb.x1, bb.y1, bb.x2 - bb.x1, bb.y2 - bb.y1); pop();
        }
        push();
        stroke(d.trunkColor); strokeWeight(d.trunkWidth); strokeCap(ROUND);
        line(x, y, x, y + d.trunkHeight);
        if (d.trunkType === 'lineaRamas') {
            const rama = min(24, d.trunkHeight * 0.35);
            const y1 = y + d.trunkHeight * 0.4;
            const y2 = y + d.trunkHeight * 0.7;
            const a = PI / 6;
            line(x, y1, x - rama * cos(a), y1 + rama * sin(a));
            line(x, y2, x + rama * cos(a), y2 + rama * sin(a));
        }
        pop();
        const leftColor = color(d.crownColor);
        const rightColor = color(red(leftColor) * 0.7, green(leftColor) * 0.7, blue(leftColor) * 0.7);
        const cx = x, cy = y + d.trunkHeight + d.crownHeight * 0.5;
        switch (d.crownShape) {
            case 'triangulo':
                push(); noStroke(); fill(leftColor);
                beginShape();
                vertex(cx, y + d.trunkHeight + d.crownHeight);
                vertex(cx - d.crownWidth / 2, y + d.trunkHeight);
                vertex(cx, y + d.trunkHeight);
                endShape(CLOSE);
                pop();
                push(); noStroke(); fill(rightColor);
                beginShape();
                vertex(cx, y + d.trunkHeight + d.crownHeight);
                vertex(cx, y + d.trunkHeight);
                vertex(cx + d.crownWidth / 2, y + d.trunkHeight);
                endShape(CLOSE);
                pop();
                break;
            case 'circulo':
                push(); noStroke(); fill(leftColor);
                arc(cx, cy, (d.crownWidth + d.crownHeight) * 0.5, (d.crownWidth + d.crownHeight) * 0.5, HALF_PI, 3 * HALF_PI, PIE);
                pop();
                push(); noStroke(); fill(rightColor);
                arc(cx, cy, (d.crownWidth + d.crownHeight) * 0.5, (d.crownWidth + d.crownHeight) * 0.5, 3 * HALF_PI, HALF_PI, PIE);
                pop();
                break;
            case 'elipse':
                push(); noStroke(); fill(leftColor);
                arc(cx, cy, d.crownWidth, d.crownHeight, HALF_PI, 3 * HALF_PI, PIE);
                pop();
                push(); noStroke(); fill(rightColor);
                arc(cx, cy, d.crownWidth, d.crownHeight, 3 * HALF_PI, HALF_PI, PIE);
                pop();
                break;
        }
    }
}
const cXoffsetT = 200 + 1500 * Math.random();
const cYoffsetT = 200 + 1500 * Math.random();
class Forest {
    constructor(treeDistance, treePosXVariation) {
        this.arboles = [];
        this.treeDistance = treeDistance;
        this.treePosXVariation = treePosXVariation;
    }
    firstTree() {
        this.arboles.push(new Tree(0, 0));
    }
    addTreeAt(x, y) {
        const dna = DNA.dnaPosition(x, y);
        this.arboles.push(new Tree(x, y, dna));
    }
    addTreeArea(areaSize = 10) {
        let treeIntentados = 0;
        for (let x = -areaSize*this.treeDistance; x < areaSize*this.treeDistance; x = x+this.treeDistance) {
            for (let y = -areaSize*this.treeDistance; y < areaSize*this.treeDistance; y = y+this.treeDistance) {
                treeIntentados++;
                this.addTreeAt(x + this.treeDistance * random(-this.treePosXVariation, +this.treePosXVariation), y + this.treeDistance * random(-this.treePosXVariation, +this.treePosXVariation));
            }
        }
        console.log(`Árboles creados en área: ${this.arboles.length} de intentados ${treeIntentados}`);
        console.log('Límite bounding box:', this.boundingBox());
    }
    boundingBox() {
        return {
            x1:  Math.min(...this.arboles.map(a => a.x)),
            y1:  Math.max(...this.arboles.map(a => a.y)),
            x2:  Math.max(...this.arboles.map(a => a.x)),
            y2:  Math.min(...this.arboles.map(a => a.y))
        };
    }
    crearHijosPrimeros() {
        if (this.arboles.length === 0) { console.log("crearHijosPrimeros length === 0"); return};;
        const padre = this.arboles[0];
        const dnaR = padre.hijoDNA();
        const xR = padre.x + this.treeDistance;
        const yR = padre.y;
        if (this._cabe(xR, yR, dnaR)) this.arboles.push(new Tree(xR, yR, dnaR));
        const dnaB = padre.hijoDNA();
        const xB = padre.x;
        const yB = padre.y + this.treeDistance;
        if (this._cabe(xB, yB, dnaB)) this.arboles.push(new Tree(xB, yB, dnaB));
    }
    spawnLast() {
        if (this.arboles.length === 0) { console.log("spawnLast length === 0"); return};
        const padre = this.arboles[this.arboles.length-1];
        const dnaR = padre.hijoDNA();
        const xR = padre.x + this.treeDistance;
        const yR = padre.y;
        if (this._cabe(xR, yR, dnaR)) this.arboles.push(new Tree(xR, yR, dnaR));
        const dnaB = padre.hijoDNA();
        const xB = padre.x;
        const yB = padre.y + this.treeDistance;
        if (this._cabe(xB, yB, dnaB)) this.arboles.push(new Tree(xB, yB, dnaB));
    }
    crecerPorGeneraciones(n = 1) {
        for (let g = 0; g < n; g++) {
            const nuevos = [];
            for (const padre of this.arboles) {
                const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
                for (const [dx, dy] of dirs) {
                    const hijoDNA = padre.hijoDNA();
                    const nx = padre.x + this.treeDistance;
                    const ny = padre.y + this.treeDistance;
                    if (this._cabe(nx, ny, hijoDNA) && this._noColisiona(nx, ny, hijoDNA)) {
                        nuevos.push(new Tree(nx, ny, hijoDNA));
                    }
                }
            }
            this.arboles.push(...nuevos);
        }
    }
    crecerPorGeneracionesPosicion(n = 1) {
        for (let g = 0; g < n; g++) {
            const nuevos = [];
            for (const padre of this.arboles) {
                const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
                for (const [dx, dy] of dirs) {
                    const nx = padre.x + this.treeDistance;
                    const ny = padre.y + this.treeDistance;
                    const hijoDNA = DNA.dnaPosition(nx, ny);
                    const salto = max(padre.dna.spaceNeeded, hijoDNA.spaceNeeded) * 1.2;
                    nuevos.push(new Tree(nx, ny, hijoDNA));
                }
            }
            this.arboles.push(...nuevos);
        }
    }
    _cabe(x, y, dna) {
        return true;         
        const m = this.margen;
        return (
            x - dna.crownWidth * 0.6 > m &&
            x + dna.crownWidth * 0.6 < width - m &&
            y - dna.trunkHeight - dna.crownHeight - 10 > m &&
            y + 10 < height - m
        );
    }
    _noColisiona(x, y, dna) {
        for (const t of this.arboles) {
            const minDist = (t.dna.spaceNeeded + dna.spaceNeeded) * 0.5;
            if (dist(x, y, t.x, t.y) < minDist * 0.9) return false;
        }
        return true;
    }
    draw(xmin = -Infinity, xmax = Infinity, ymin = -Infinity, ymax = Infinity) {
        if (debugShowBoundingBox) {
            const bb = this.boundingBox();
            push(); stroke('green');strokeWeight(25); noFill(); rect(bb.x1, bb.y1, bb.x2 - bb.x1, bb.y2 - bb.y1); pop();
        }
        let dibujados = 0;
        const ordenados = [...this.arboles].sort((a, b) => b.y - a.y);
        for (const arbol of ordenados) {
            if (
                arbol.x >= xmin && arbol.x <= xmax &&
                arbol.y >= ymin && arbol.y <= ymax
            ) {
                arbol.draw();
                dibujados++;
            }
            else {
            }
        }
    }
    drawGrid(xmin = -Infinity, xmax = Infinity, ymin = -Infinity, ymax = Infinity) {
        const step = this.treeDistance;
        const startX = Math.floor(xmin / step) * step;
        const endX   = Math.ceil(xmax / step) * step;
        const startY = Math.floor(ymin / step) * step;
        const endY   = Math.ceil(ymax / step) * step;
        for (let x = startX; x <= endX; x += step) {
            for (let y = endY; y > startY; y -= step) {
                const tx = x + this.treeDistance * noise(x/cXoffsetT, (y+500) /cYoffsetT);
                const ty = y + this.treeDistance * noise(x/cXoffsetT, (y+300) /cYoffsetT);
                const dna = DNA.dnaPosition(tx, ty);
                const tempTree = new Tree(tx, ty, dna);
                tempTree.draw();
            }
        }
    }
    drawGridDebug(xmin = -Infinity, xmax = Infinity, ymin = -Infinity, ymax = Infinity) {
        const step = this.treeDistance;
        const x0 = Math.round(xmin / step) * step;
        const x1 = Math.round(xmax / step) * step;
        const y0 = Math.round(ymin / step) * step;
        const y1 = Math.round(ymax / step) * step;
        const xStep = x0 <= x1 ? step : -step;
        const yStep = y0 <= y1 ? step : -step;
        for (let x = x0; (xStep > 0 ? x <= x1 : x >= x1); x += xStep) {
            for (let y = y0; (yStep > 0 ? y <= y1 : y >= y1); y += yStep) {
                push();
                stroke('red');
                if (x === 0 && y === 0) {
                    stroke('blue');
                    strokeWeight(12);
                }
                strokeWeight(10);
                point(x, y);
                pop();
                let sx = worldToScreenX(x);
                let sy = worldToScreenY(y);
                push();
                resetMatrix(); 
                fill('black');
                stroke('white');
                strokeWeight(2);
                textSize(12);
                textAlign(CENTER, BOTTOM);
                text(`(${x}, ${y})`, sx, sy - 12);
                stroke(0);
                strokeWeight(3);
                point(sx, sy-5);
                pop();
            }
        }
    }
}
function drawGridForForest(forest, stepX = 150, stepY = 150, padding = 20) {
  if (!forest || !forest.arboles || forest.arboles.length === 0) return;
  let minX = screenToWorldX(0);
  let maxX = screenToWorldX(width);
  let minY = screenToWorldY(height);
  let maxY = screenToWorldY(0);
  minX -= padding; maxX += padding;
  minY -= padding; maxY += padding;
  const startX = Math.floor(minX / stepX) * stepX;
  const endX   = Math.ceil (maxX / stepX) * stepX;
  const startY = Math.floor(minY / stepY) * stepY;
  const endY   = Math.ceil (maxY / stepY) * stepY;
  push();
  stroke(0, 90);
  strokeWeight(1);
  for (let x = startX; x <= endX; x += stepX) {
    line(x, startY, x, endY);
  }
  for (let y = startY; y <= endY; y += stepY) {
    line(startX, y, endX, y);
  }
  const etiquetasX = [];
  const etiquetasY = [];
  for (let wx = startX; wx <= endX; wx += 300) {
    const sx = worldToScreenX(wx) + 2;
    const sy = height/2;
    etiquetasX.push({ sx, sy: stepY/2, valor: wx });
    etiquetasX.push({ sx, sy, valor: wx });
    etiquetasX.push({ sx, sy: height - stepY/2, valor: wx });
  }
  for (let wy = startY; wy <= endY; wy += 300) {
    const sx = width/2;
    const sy = worldToScreenY(wy) - 3;
    etiquetasY.push({ sx: stepX/2, sy, valor: wy });
    etiquetasY.push({ sx, sy, valor: wy });
    etiquetasY.push({ sx: width - stepX/2, sy, valor: wy });
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
function colorToHex(c) {
  const r = nf(red(c),   2, 0);
  const g = nf(green(c), 2, 0);
  const b = nf(blue(c),  2, 0);
  const rh = ('0' + int(r).toString(16)).slice(-2);
  const gh = ('0' + int(g).toString(16)).slice(-2);
  const bh = ('0' + int(b).toString(16)).slice(-2);
  return `#${rh}${gh}${bh}`.toUpperCase();
}
function treeBounds(t) {
  const d = t.dna;
  const halfW = Math.max(d.crownWidth * 0.6, d.trunkWidth * 0.5);
  const left   = t.x - halfW;
  const right  = t.x + halfW;
  const top    = t.y + d.trunkHeight + d.crownHeight;  
  const bottom = t.y;
  return { left, right, top, bottom };
}
function treeHit(t, wx, wy) {
  const b = treeBounds(t);
  return wx >= b.left && wx <= b.right && wy <= b.top && wy >= b.bottom;
}
function findTreeUnderMouse(forest) {
  if (!forest || !forest.arboles) { console.log("No hay árboles en el bosque."); return null;}
  const mx = screenToWorldX(mouseX);
  const my = screenToWorldY(mouseY);
  for (let i = forest.arboles.length - 1; i >= 0; i--) {
    const t = forest.arboles[i];
    if (treeHit(t, mx, my)) { 
      return t;
    }
  }
  return null;
}
function drawTreeTooltip(t) {
  const d = t.dna;
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
  push();
  resetMatrix(); 
  textFont('monospace');
  textSize(12);
  const pad = 8;
  let w = 0;
  for (const line of lines) w = Math.max(w, textWidth(line));
  const h = lines.length * 16; 
  let canvasW = drawingContext.canvas.width;
  let canvasH = drawingContext.canvas.height;
  let x = mouseX + 14;
  let y = mouseY + 14;
  if (x + w + pad * 2 > canvasW)  x = canvasW  - w - pad * 2;
  if (y + h + pad * 2 > canvasH) y = canvasH - h - pad * 2;
  noStroke();
  rectMode(CORNER);
  fill(255, 230); 
  rect(x, y, w + pad * 2, h + pad * 2, 8);
  stroke(0, 60);
  noFill();
  rect(x, y, w + pad * 2, h + pad * 2, 8);
  fill(20);
  noStroke();
  let ty = y + pad + 12;
  for (const line of lines) {
    text(line, x + pad, ty);
    ty += 16;
  }
  pop();
}
function logCursorPosition() {
  console.log("---------------------------");
  console.log(`Cursor position: (${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`);
  console.log(`World position: (${screenToWorldX(mouseX).toFixed(1)}, ${screenToWorldY(mouseY).toFixed(1)})`);
  console.log(`Camera scale: ${viewScale.toFixed(1)}`);
  console.log(`Camera offset: (${viewOffsetX.toFixed(1)}, ${viewOffsetY.toFixed(1)})`);
}
let touchX = 0;
let touchY = 0;
function setupMobileInput(canvas, onMove) {
  let lastTouch = null;
  const panStep = 20;
  const threshold = 30; 
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
          if (window.pan) window.pan(panStep, 0); 
          lastTouch = {x, y};
        } else if (dx < -threshold) {
          if (window.pan) window.pan(-panStep, 0); 
          lastTouch = {x, y};
        }
      } else {
        if (dy > threshold) {
          if (window.pan) window.pan(0, panStep); 
          lastTouch = {x, y};
        } else if (dy < -threshold) {
          if (window.pan) window.pan(0, -panStep); 
          lastTouch = {x, y};
        }
      }
      if (typeof onMove === 'function') {
        onMove(x, y);
      }
      if (window.loop) window.loop();
    }
  }, false);
}
const keysDown = {}
const panStep = 20;
let isMobile = false;
function initInput(canvas) {
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
function keyPressed() {
  keysDown[keyCode] = true;
  if (key === 'q' || key === 'Q') {
    loop();     
  }
  if (key === "1") {    logCursorPosition();  }
  if (keyCode===LEFT_ARROW)  { pan(panStep,0); loop();  }   
  if (keyCode===RIGHT_ARROW) { pan(-panStep,0); loop(); }
  if (keyCode===UP_ARROW)    { pan(0,panStep); loop();  }
  if (keyCode===DOWN_ARROW)  { pan(0,-panStep); loop(); }
  if (key === 'g' || key === 'G') { toggleGrid(); redraw(); }
}
function keyReleased() {
  if (key === 'q' || key === 'Q') { 
    noLoop();                                  
    redraw();                                  
  }
  if (!keyIsDown(LEFT_ARROW)) {keysDown[LEFT_ARROW] = false;};
  if (!keyIsDown(RIGHT_ARROW)) {keysDown[RIGHT_ARROW] = false};
  if (!keyIsDown(UP_ARROW)) {keysDown[UP_ARROW] = false};
  if (!keyIsDown(DOWN_ARROW)) {keysDown[DOWN_ARROW] = false};
  let someKeyStillPressed = false;
  [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW].every(code => someKeyStillPressed = someKeyStillPressed  || keysDown[code]);
  if (!someKeyStillPressed) {
          noLoop(); 
          redraw();
  }   
}
function mouseMoved() {
  if (keyIsDown(81) || keyIsDown(113) ) redraw();                 
}
function handleZoom(event) {
  event.preventDefault();
  const zoomFactor = event.deltaY < 0 ? 1.03 : 0.97;
  zoomAt(mouseX, mouseY, zoomFactor);
  redraw();
  return false;
}
function handleContinuousPan() {
  if (keysDown[LEFT_ARROW])  pan(panStep, 0);
  if (keysDown[RIGHT_ARROW]) pan(-panStep, 0);
  if (keysDown[UP_ARROW])    pan(0, panStep);
  if (keysDown[DOWN_ARROW])  pan(0, -panStep)    
}
let cnv;
let showGrid = false; 
function toggleGrid() {
    showGrid = !showGrid;
}
function setupCanvas() {
  let canvasWidth = min(800, windowWidth);
  let canvasHeight = min(600, windowHeight);
  console.log(`canvas created: ${canvasWidth}x${canvasHeight}`);
  cnv = createCanvas(canvasWidth, canvasHeight);
  resetCanvas();
  return cnv;
}
function resetCanvas() {
  clear();
  angleMode(RADIANS);
  rectMode(CORNER); 
  frameRate(12);
  setCameraParameters(0.4, width/2, height/2);
  noLoop();
  redraw();
}
function draw() {
  clear();
  background( "#d6eac3" );  
  noStroke();
  applyCamera();
  _showGridIfNeeded();
  _drawVisibleForest();
  _showTooltipIfQPressed();
  handleContinuousPan();
}
function windowResized() {
  let canvasWidth = min(800, windowWidth);
  let canvasHeight = min(600, windowHeight);
  cnv.position((windowWidth - width) / 2, document.getElementById('ui').offsetHeight + 18);
  console.log(`canvas resized: ${canvasWidth}x${canvasHeight}`);
  resizeCanvas(canvasWidth, canvasHeight);
  setCameraParameters(0.4, width/2, height/2);
}
function _drawVisibleForest() {
  const margin = 0.30; 
  let wx0 = screenToWorldX(0);
  let wy0 = screenToWorldY(0);
  let wx1 = screenToWorldX(width);
  let wy1 = screenToWorldY(height);
  if (debugShowBoundingBox) console.log('camara: ', getCameraParameters());
  if (debugShowBoundingBox) console.log(`World screen corners: (${wx0.toFixed(1)}, ${wy0.toFixed(1)}) to (${wx1.toFixed(1)}, ${wy1.toFixed(1)})`);
  const dx = Math.abs(wx1 - wx0) * margin;
  const dy = Math.abs(wy1 - wy0) * margin;
  const xmin = Math.min(wx0, wx1) - dx;
  const xmax = Math.max(wx0, wx1) + dx;
  const ymin = Math.min(wy0, wy1) - dy;
  const ymax = Math.max(wy0, wy1) + dy;
  if (debugShowBoundingBox)   console.log(`World to draw : (${xmin.toFixed(1)}, ${ymax.toFixed(1)} ) to (${xmax.toFixed(1)}, ${ymin.toFixed(1)})`);
  bosque.drawGrid(xmin, xmax, ymin, ymax);
}
function _showTooltipIfQPressed () {
  if (keyIsDown(81) || keyIsDown(113)) { 
    const hovered = findTreeUnderMouse(bosque);
    if (hovered) {
      drawTreeTooltip(hovered);
    }
  }
}
function _showGridIfNeeded() {
  if (showGrid) {
    drawGridForForest(bosque, 150, 150, 20);
  }
}
const initialForestSize = 1; 
const debugShowBoundingBox = false;
const treeDistance = 150 + 20 * Math.random();  
const treePosXVariation = 0.6;
let seedValue = Math.floor(Math.random()*1e9);
let bosque;
function setup() {
  let c = setupCanvas();
  c.parent('canvas-container');   
  const uiOffset = document.getElementById('ui').offsetHeight + 18;
  c.position((windowWidth - c.width) / 2, uiOffset);
  c.elt.setAttribute('tabindex', '0'); 
  c.elt.addEventListener('mouseenter', () => c.elt.focus());
  let cnv2 = document.querySelector('canvas');   
  cnv2.addEventListener('wheel', handleZoom, { passive: false });
  initInput(cnv2);
  const $ = sel => document.querySelector(sel);
  $('#seed').value = seedValue;
  $('#btnNewSeed').onclick = () => {
    seedValue = Math.floor(Math.random()*1e9);
    $('#seed').value = seedValue;
    reiniciar();
  };
  $('#btnReset').onclick = () => reiniciar();
  $('#btnSave').onclick = () => saveCanvas('bosque_genetico','png');
  window.addEventListener('keydown', (e)=>{
    if(e.key==='g') { bosque.crecerPorGeneraciones(1); redraw(); }
    if(e.key==='s') { saveCanvas('bosque_genetico','png'); }
    if(e.key==='r') { reiniciar(); }
  });
  reiniciar();
}
function reiniciar() {
  console.log("Reiniciando con semilla:", seedValue);
  randomSeed(seedValue);
  noiseSeed(seedValue);
  bosque = new Forest(treeDistance, treePosXVariation);
  bosque.addTreeArea(initialForestSize);
  resetCanvas();
}
