
import { DNA } from "./DNA.js";


/*=========================== TREE ===========================

    Tree have a position and a DNA.

    draw() draws the tree using its DNA properties.
    hijoDNA() returns a mutated DNA for the child tree.

*/


export class Tree {

    constructor(x, y, dna) { 
        // world coordinates
        this.x = x; 
        this.y = y; 
        if (dna == null) {
            this.dna = DNA.aleatorio();
        } else {
            this.dna = dna;
        }
    }

    hijoDNA() { 
        return this.dna.mutado10();
     }

    // dibuixa en world coordinates, cal fer applyCamera() abans
    draw() { 

        const d = this.dna;
        const x = this.x;
        const y = this.y;

        // Tronco
        push();
        stroke(d.trunkColor); strokeWeight(d.trunkWidth); strokeCap(ROUND);
        line(x, y, x, y + d.trunkHeight);
        if (d.trunkType === 'lineaRamas') {
            const rama = min(24, d.trunkHeight * 0.35);
            const y1 = y - d.trunkHeight * 0.4, y2 = y + d.trunkHeight * 0.7;
            const a = PI / 6;
            line(x, y1, x - rama * cos(a), y1 + rama * sin(a));
            line(x, y2, x + rama * cos(a), y2 + rama * sin(a));
        }
        pop();

        // Copa
        push();
        noStroke(); fill(d.crownColor);
        const cx = x, cy = y + d.trunkHeight + d.crownHeight * 0.5;
        switch (d.crownShape) {
            case 'triangulo': triangle(cx - d.crownWidth / 2, y + d.trunkHeight, cx + d.crownWidth / 2, y + d.trunkHeight, cx, y + d.trunkHeight + d.crownHeight); break;
            case 'circulo': circle(cx, cy, (d.crownWidth + d.crownHeight) * 0.5); break;
            case 'rombo': push(); translate(cx, cy); rotate(PI / 4); rect(0, 0, d.crownWidth * 0.8, d.crownHeight * 0.8); pop(); break;
            case 'elipse': ellipse(cx, cy, d.crownWidth, d.crownHeight); break;
        }
        pop();
    }

}
