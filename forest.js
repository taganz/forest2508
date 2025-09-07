

/*=========================== FOREST ===========================

- first tree at 0, 0


*/
import { drawTree } from './tree.js';
import { dnaFromPosition } from './DNA.js';
import { worldToScreenX, worldToScreenY} from './camera.js';

export class Forest {
    constructor(treeDistance, treePosXVariation) {
        this.arboles = [];
        this.treeDistance = treeDistance;
        this.treePosXVariation = treePosXVariation;
    }


    // Dibuja una cuadrícula de árboles generando el DNA para cada posición visible
    // No fa servir els arbres guardats, nomes la posició
    drawGrid(xmin = -Infinity, xmax = Infinity, ymin = -Infinity, ymax = Infinity) {
        //console.log(`Grid: (${xmin}, ${ymin}) a (${xmax}, ${ymax})`);
        // Calcula los múltiplos de treeDistance que cubren la ventana
        const step = this.treeDistance;
        // Asegura que los límites sean múltiplos exactos de step
        const startX = Math.floor(xmin / step) * step;
        const endX   = Math.ceil(xmax / step) * step;
        const startY = Math.floor(ymin / step) * step;
        const endY   = Math.ceil(ymax / step) * step;
        //console.log(`Grid snap (${startX}, ${startY}) a (${endX}, ${endY}) con paso ${step}`);
        for (let y = endY; y > startY; y -= step) {
            for (let x = startX; x <= endX; x += step) {
                const dna = dnaFromPosition(x, y, this.treeDistance, this.treePosXVariation);
                drawTree(x, y, dna);
                if (x === startX && y === endY) {
                   // console.log("drawGrid corners: ", {x0: startX, y0: endY, x1: endX, y1: startY});
                   // console.log("treeDistance, treePosXVariation: ", this.treeDistance, this.treePosXVariation);
                   // console.log("First tree DNA: ", dna);
                }
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
