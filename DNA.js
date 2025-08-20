const paletaVerdes = [
    '#6FBF73', '#4CAF50', '#81C784',
    '#2E7D32', '#A5D6A7'
];

const paletaMarron = [
    '#7B4B21', '#8D5524',
    '#A97142', '#5D3A1A'
];

const formas = ['triangulo', 'circulo', 'rombo', 'elipse'];
        

/*=========================== DNA ===========================*/
export class DNA {
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
        const formas = ['triangulo', 'circulo', 'rombo', 'elipse'];
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
        const crownShape = formas[Math.floor( (formas.length) *  Math.abs(Math.sin (x/500 + Math.PI/2)))];   // <--- controlar cas 1
        const crownWidth = 50; // 28 + 28 + 80 * sin (x/3000 + Math.PI/3) * cos (y/3000 + Math.PI/2);
        const crownHeight = 80; // 30 + 30 + 120 * sin (x/1000 + 20) * cos (y/1000 + 20);
        const crownColor = paletaVerdes[Math.floor( (paletaVerdes.length) * Math.abs(Math.sin (x/500 + Math.PI/3)))]; // <--- controlar cas 1
        const trunkType = Math.random(['linea', 'lineaRamas']);
        const trunkWidth = 10; // 4 + 4 +  14 * sin (x/1000 + Math.PI/2) * cos (y/1000 + Math.PI/2);
        const trunkHeight = 45; // 30 + 30 + 90 * sin (x/1000 + Math.PI/3) * cos (y/1000 + Math.PI/3);
        const trunkColor = Math.random(paletaMarron);
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
            const factor = 1 + random([-0.1, 0.1]); // ±10%
            nd[k] = max(1, this[k] * factor);
            if (k === 'crownWidth' || k === 'trunkHeight') {
                nd.spaceNeeded = max(60, nd.crownWidth * 1.2, nd.trunkHeight * 0.9);
            }
        } else {
            const k = random(disc);
            if (k === 'crownShape') {
                const formas = ['triangulo', 'circulo', 'rombo', 'elipse'];
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