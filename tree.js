

import { DNA } from "./DNA.js";
import { debugShowBoundingBox } from "./main.js";


/*=========================== TREE ===========================

    Tree have a position and a DNA.

    draw() draws the tree using its DNA properties.
    hijoDNA() returns a mutated DNA for the child tree.

*/


export class Tree {

    constructor(wx, wy, dna) { 
        // world coordinates
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
        // Tronco
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

        // Copa
        push();
        noStroke();
        fill(d.crownColor);
        const cx = x, cy = y + d.trunkHeight + d.crownHeight * 0.5;
        switch (d.crownShape) {
            case 'triangulo': triangle(cx - d.crownWidth / 2, y + d.trunkHeight, cx + d.crownWidth / 2, y + d.trunkHeight, cx, y + d.trunkHeight + d.crownHeight); break;
            case 'circulo': circle(cx, cy, (d.crownWidth + d.crownHeight) * 0.5); break;
            case 'elipse': ellipse(cx, cy, d.crownWidth, d.crownHeight); break;
        }
        pop();
    }

}
