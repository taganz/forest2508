import { zone2Num } from './biomes.js';   // aixo hauria d'estar dins del biomeSystem? <----
import { zoneSystem } from './main.js';

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
        
// parameters for x,y adaptation, that should be done by evolution....
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

 
const cXoffsetT = -0.5 + 1 * Math.random();
const cYoffsetT = -0.5 + 1 * Math.random();


/*=========================== DNA ===========================*/
export class DNA {
    constructor({ crownShape, crownHeight, crownWidth, crownColor, trunkType, trunkHeight, trunkWidth, trunkColor, spaceNeeded, xoffset, yoffset }) {
        this.crownShape = crownShape;
        this.crownHeight = crownHeight;
        this.crownWidth = crownWidth;
        this.crownColor = crownColor;
        this.trunkType = trunkType;
        this.trunkHeight = trunkHeight;
        this.trunkWidth = trunkWidth;
        this.trunkColor = trunkColor;
        this.spaceNeeded = spaceNeeded;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
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
            spaceNeeded,
            xoffset: cXoffsetT,
            yoffset: cYoffsetT
        });

    }
    static dnaPosition(x, y, treeDistance=150) {           
        const zone = zoneSystem.getZone(x, y);
        const zoneNum = zone2Num(zone.id);

        // Make crownShape change proportionally to zoneNum
        // zoneNum starts at 1, formas.length is the number of shapes
        // Map zoneNum to [0, formas.length-1]
        const idx = Math.max(0, Math.min(formas.length - 1, Math.round((zoneNum - 1) * (formas.length - 1) / Math.max(1, 7 - 1))));
        const crownShape = formas[idx];
        //const crownWidth =  cwA1 * Math.abs(Math.sin (x/cwTx + cwFx)) + cwA2 * Math.abs(Math.cos (y/cwTy + cwFy));
        const crownWidth = 40 + noise(x/300, y/300) * 150;
        //const crownHeight = chA1 * Math.abs(Math.sin (x/chTx + chFx)) + chA2 * Math.abs(Math.cos (y/chTy + chFy));
        const crownHeight = 30 + noise((x+50)/400, (y+50)/30) * 150;
    // Make crownColor proportional to zoneNum
    // Map zoneNum to [0, paletaVerdes.length-1]
    const idxColor = Math.max(0, Math.min(paletaVerdes.length - 1, Math.round((zoneNum - 1) * (paletaVerdes.length - 1) / Math.max(1, 7 - 1))));
    const crownColor = paletaVerdes[idxColor];
        const trunkType = random(['linea', 'lineaRamas']);
        const trunkWidth = 10; // 4 + 4 +  14 * sin (x/1000 + Math.PI/2) * cos (y/1000 + Math.PI/2);
        const trunkHeight = 45; // 30 + 30 + 90 * sin (x/1000 + Math.PI/3) * cos (y/1000 + Math.PI/3);
        const trunkColor = random(paletaMarron);
        const spaceNeeded = Math.max(60, crownWidth * 1.2, trunkHeight * 0.9);
        const xoffset = treeDistance *  (1+zoneNum/30); 
        const yoffset = treeDistance *  (1+zoneNum/30); 

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
            , xoffset: xoffset
            , yoffset: yoffset
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