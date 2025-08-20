/*=========================== FOREST ===========================

- first tree at 0, 0


*/
import { Tree } from './tree.js';
import { DNA } from './DNA.js';

const treeDistance = 150;
const treePosXVariation = 0.1;

export class Forest {
    constructor() {
        this.arboles = [];
    }
    firstTree() {
        this.arboles.push(new Tree(0, 0));
        
    }
    addTreeAt(x, y) {
        const dna = DNA.dnaPosition(x, y);
        this.arboles.push(new Tree(x, y, dna));
    }
    addTreeArea(areaSize = 10) {
        for (let x = -areaSize*treeDistance; x < areaSize*treeDistance; x = x+treeDistance) {
            for (let y = -areaSize*treeDistance; y < areaSize*treeDistance; y = y+treeDistance) {
                this.addTreeAt(x + treeDistance * random(-treePosXVariation, +treePosXVariation), y + treeDistance * random(-treePosXVariation, +treePosXVariation));
            }
        }
    }
  
    // aquesta a desapareixer...
    crearHijosPrimeros() {
        if (this.arboles.length === 0) { console.log("crearHijosPrimeros length === 0"); return};;
        const padre = this.arboles[0];
        const dnaR = padre.hijoDNA();
        const xR = padre.x + treeDistance;
        const yR = padre.y;
        if (this._cabe(xR, yR, dnaR)) this.arboles.push(new Tree(xR, yR, dnaR));
        const dnaB = padre.hijoDNA();
        const xB = padre.x;
        const yB = padre.y + treeDistance;
        if (this._cabe(xB, yB, dnaB)) this.arboles.push(new Tree(xB, yB, dnaB));
    }

    spawnLast() {
        if (this.arboles.length === 0) { console.log("spawnLast length === 0"); return};
        const padre = this.arboles[this.arboles.length-1];
        const dnaR = padre.hijoDNA();
        const xR = padre.x + treeDistance;
        const yR = padre.y;
        if (this._cabe(xR, yR, dnaR)) this.arboles.push(new Tree(xR, yR, dnaR));
        const dnaB = padre.hijoDNA();
        const xB = padre.x;
        const yB = padre.y + treeDistance;
        if (this._cabe(xB, yB, dnaB)) this.arboles.push(new Tree(xB, yB, dnaB));
    }
    crecerPorGeneraciones(n = 1) {
        for (let g = 0; g < n; g++) {
            const nuevos = [];
            for (const padre of this.arboles) {
                const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
                for (const [dx, dy] of dirs) {
                    const hijoDNA = padre.hijoDNA();
                    const nx = padre.x + treeDistance;
                    const ny = padre.y + treeDistance;
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
                    const nx = padre.x + treeDistance;
                    const ny = padre.y + treeDistance;
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
    dibujar() {
        // Ordenar los árboles por Y (más lejos primero)
        const ordenados = [...this.arboles].sort((a, b) => b.y - a.y);
        for (const t of ordenados) t.draw();
    }
}
