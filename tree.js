

import { debugShowBoundingBox } from "./main.js";

/*=========================== TREE ===========================

    Tree have a position and a DNA.

    draw() draws the tree using its DNA properties.
    hijoDNA() returns a mutated DNA for the child tree.

*/
const debugHideTrees = false;  // if true, hides all trees and draw only base

let drawTreeBase = false;  // dibuixa una elipse sota l'arbre amb el color de la zona
const treeBaseSizeX = 100;  // 50  - 200 to fill region
const treeBaseSizeY = 50;  // 25  - 200 to fill region

export function setDrawTreeBase(dtb=null) {
    if (dtb === null) dtb = !drawTreeBase;
    drawTreeBase = dtb;
}


export class Tree {

    constructor(wx, wy, dna) { 
        // world coordinates
        this.x = wx + dna.xoffset; 
        this.y = wy + dna.yoffset; 
        this.dna = dna;
        this.zone = dna.zone;
        this.zoneNum = dna.zoneNum;
        const c = this.zone.color;
        const alpha = 200; // Ajusta de 0 a 255 según la transparencia deseada
        this.zoneColor = color(red(c) * 0.7, green(c) * 0.7, blue(c) * 0.7, alpha);
    }

    hijoDNA() { 
        return this.dna.mutado10();
     }

     
    // Devuelve el bounding box del árbol en formato {x1, y1, x2, y2}
    // --> es podria calcular en constructor
    boundingBox() {
        const d = this.dna;
        // El tronco va de (x, y) a (x, y + d.trunkHeight)
        // La copa puede sobresalir por los lados y arriba/abajo según la forma
        // Consideramos el rectángulo que contiene todo: tronco + copa
        // Suponemos que la copa está centrada en x, encima del tronco
        const x1 = this.x - d.crownWidth / 2;
        const x2 = this.x + d.crownWidth / 2;
        const y1 = this.y;
        // El punto más bajo es el fondo de la copa
        const y2 = this.y + d.trunkHeight + d.crownHeight;
        return { x1, y1, x2, y2 };

            /* per afegir les copes etc mirar aixo
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
                */

    }

    // dibuixa en world coordinates, cal fer applyCamera() abans
    draw() { 

        const d = this.dna;
        const x = this.x;
        const y = this.y;

        if (debugShowBoundingBox) {
            // punt referencia i bounding box
            const bb = this.boundingBox();
            push(); stroke('red');strokeWeight(54); point(x, y); pop();
            push(); stroke('red');strokeWeight(5); noFill(); rect(bb.x1, bb.y1, bb.x2 - bb.x1, bb.y2 - bb.y1); pop();
        }
        
        // base
        if (drawTreeBase){ 
            push();
            fill(this.zoneColor);
            noStroke();
            ellipse(this.x, this.y, treeBaseSizeX, treeBaseSizeY);
            pop();
        }

        if (debugHideTrees) return;

        switch(d.trunkType) {
            case 'linea':
                _drawTrunkLinea(x, y, d.trunkHeight, d.trunkWidth, d.trunkColor);
                break;
            case 'lineaRamas':
                _drawTrunkLineaRamas(x, y, d.trunkHeight, d.trunkWidth, d.trunkColor);
                break;
            default:
                _drawTrunkLinea(x, y, d.trunkHeight, d.trunkWidth, d.trunkColor);
                console.log("Invalid trunk type ", d.trunkType);
        }

        switch (d.crownShape) {
            case 'triangulo':
                _drawCrownTriangle(x, y, d.trunkHeight, d.crownWidth, d.crownHeight, d.crownColor);
                break;
            case 'circulo':
                _drawCrownCircle(x, y,  d.trunkHeight, d.crownWidth, d.crownHeight, d.crownColor);
                break;

            case 'elipse':
                _drawCrownEllipse(x, y, d.trunkHeight, d.crownWidth, d.crownHeight, d.crownColor);
                break;
            default:
                _drawCrownCircle(x, y,  d.trunkHeight, d.crownWidth, d.crownHeight, d.crownColor);
                console.log("Invalid crown shape ", d.crownShape);

        }
    }

}



function _drawTrunkLinea(x, y, trunkHeight, trunkWidth, trunkColor) {
    push();
    stroke(trunkColor);
    strokeWeight(trunkWidth);
    line(x, y, x, y + trunkHeight);
    pop();
}


function _drawTrunkLineaRamas(x, y, trunkHeight, trunkWidth, trunkColor) {
    push();
    stroke(trunkColor);
    strokeWeight(trunkWidth);
    line(x, y, x, y + trunkHeight);
    const rama = min(24, trunkHeight * 0.35);
    const y1 = y + trunkHeight * 0.4;
    const y2 = y + trunkHeight * 0.7;
    const a = PI / 6;
    line(x, y1, x - rama * cos(a), y1 + rama * sin(a));
    line(x, y2, x + rama * cos(a), y2 + rama * sin(a));
    pop();
}

function _drawCrownTriangle(x, y, trunkHeight, crownWidth, crownHeight, crownColor) {
    const leftColor = color(crownColor);
    const rightColor = color(red(leftColor) * 0.7, green(leftColor) * 0.7, blue(leftColor) * 0.7);
    // Izquierda
    push(); noStroke(); fill(leftColor);
    beginShape();
    vertex(x, y + trunkHeight + crownHeight);
    vertex(x - crownWidth / 2, y + trunkHeight);
    vertex(x, y + trunkHeight);
    endShape(CLOSE);
    pop();

    // Derecha
    push(); noStroke(); fill(rightColor);
    beginShape();
    vertex(x, y + trunkHeight + crownHeight);
    vertex(x, y + trunkHeight);
    vertex(x + crownWidth / 2, y + trunkHeight);
    endShape(CLOSE);
    pop();
}

function _drawCrownCircle(cx, y, trunkHeight,crownWidth, crownHeight, crownColor) {
    const  cy = y + trunkHeight + crownHeight * 0.5;
    const leftColor = color(crownColor);
    const rightColor = color(red(leftColor) * 0.7, green(leftColor) * 0.7, blue(leftColor) * 0.7);
    // Izquierda
    push(); noStroke(); fill(leftColor);
    arc(cx, cy, (crownWidth + crownHeight) * 0.5, (crownWidth + crownHeight) * 0.5, HALF_PI, 3 * HALF_PI, PIE);
    pop();
    // Derecha
    push(); noStroke(); fill(rightColor);
    arc(cx, cy, (crownWidth + crownHeight) * 0.5, (crownWidth + crownHeight) * 0.5, 3 * HALF_PI, HALF_PI, PIE);
    pop();
}

function _drawCrownEllipse(cx, y, trunkHeight, crownWidth, crownHeight, crownColor) {
    const  cy = y + trunkHeight + crownHeight * 0.5;
    const leftColor = color(crownColor);
    const rightColor = color(red(leftColor) * 0.7, green(leftColor) * 0.7, blue(leftColor) * 0.7);
    // Izquierda
    push(); noStroke(); fill(leftColor);
    arc(cx, cy, crownWidth, crownHeight, HALF_PI, 3 * HALF_PI, PIE);
    pop();
    // Derecha
    push(); noStroke(); fill(rightColor);
    arc(cx, cy, crownWidth, crownHeight, 3 * HALF_PI, HALF_PI, PIE);
    pop();
}
