

/*=========================== FOREST ===========================

- first tree at 0, 0


*/
import { Tree } from './tree.js';
import { DNA } from './DNA.js';
import { debugShowBoundingBox } from './main.js';
import {worldToScreenX, worldToScreenY} from './camera.js';

const cXoffsetT = 200 + 1500 * Math.random();
const cYoffsetT = 200 + 1500 * Math.random();

export class Forest {
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
        // si arreglem el bb dels trees i el poso en constructor fer-lo servir aqui
        return {
            x1:  Math.min(...this.arboles.map(a => a.x)),
            y1:  Math.max(...this.arboles.map(a => a.y)),
            x2:  Math.max(...this.arboles.map(a => a.x)),
            y2:  Math.min(...this.arboles.map(a => a.y))
        };
    }
    // aquesta a desapareixer...
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
        return true;         // <-----------------------//
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

        // Ordenar los árboles por Y (más lejos primero)
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
                //console.log (`Árbol fuera de límites: (${arbol.x}, ${arbol.y})`)
            }
        }
        //console.log(`Árboles dibujados: ${dibujados} de ${this.arboles.length}`);
    }

    // Dibuja una cuadrícula de árboles generando el DNA para cada posición visible
    // No fa servir els arbres guardats, nomes la posició
    drawGrid(xmin = -Infinity, xmax = Infinity, ymin = -Infinity, ymax = Infinity) {
        //console.log(`Dibujando cuadrícula: (${xmin}, ${ymin}) a (${xmax}, ${ymax})`);
        // Calcula los múltiplos de treeDistance que cubren la ventana
        const step = this.treeDistance;
        // Asegura que los límites sean múltiplos exactos de step
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
    //
    // DEBUG TOOL
    //
    // Dibuja puntos rojos y muestra coordenadas de pantalla y mundo para debug
    drawGridDebug(xmin = -Infinity, xmax = Infinity, ymin = -Infinity, ymax = Infinity) {
        //console.log(`Dibujando cuadrícula: (${xmin}, ${ymin}) a (${xmax}, ${ymax})`);
        const step = this.treeDistance;
        const x0 = Math.round(xmin / step) * step;
        const x1 = Math.round(xmax / step) * step;
        const y0 = Math.round(ymin / step) * step;
        const y1 = Math.round(ymax / step) * step;
        const xStep = x0 <= x1 ? step : -step;
        const yStep = y0 <= y1 ? step : -step;
        for (let x = x0; (xStep > 0 ? x <= x1 : x >= x1); x += xStep) {
            for (let y = y0; (yStep > 0 ? y <= y1 : y >= y1); y += yStep) {
                // Dibuja punto rojo en (x, y) (coordenadas de mundo)
                push();
                stroke('red');
                if (x === 0 && y === 0) {
                    stroke('blue');
                    strokeWeight(12);
                }
                strokeWeight(10);
                point(x, y);
                pop();
                // Calcula coordenadas de pantalla
                let sx = worldToScreenX(x);
                let sy = worldToScreenY(y);
                // Dibuja el texto en coordenadas de pantalla, grande y visible
                push();
                resetMatrix(); // Elimina transformaciones de cámara
                fill('black');
                stroke('white');
                strokeWeight(2);
                textSize(12);
                textAlign(CENTER, BOTTOM);
                text(`(${x}, ${y})`, sx, sy - 12);
                stroke(0);
                strokeWeight(3);
                point(sx, sy-5);
                //text(`[${Math.round(sx)}, ${Math.round(sy)}]`, sx, sy + 18);
                pop();
            }
        }
    }

}
