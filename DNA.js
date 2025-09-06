import { zoneSystem } from './main.js';
import { random, shuffle } from './seedRandom.js';
import { selectArrayElement } from './util.js'

const paletaVerdes_base = [
    '#6FBF73' 
    ,'#C9E265' 
    ,'#81C784'
    ,'#2E7D32' 
    ,'#4CAF50'
    ,'#A5D6A7'
    ,'#B7D84B'  
];

const paletaMarron_base = [
    '#7B4B21', '#8D5524',
    '#A97142', '#5D3A1A'
];

//const formas_base = ['triangulo', 'circulo', 'elipse', 'fir'];
//const crownWidth0 = 40; 
//const crownHeight0 = 30;

const formas_base = ['watercolor'];
const crownWidth0 = 30; 
const crownHeight0 = 40;


const trunkTypesBase = ['linea', 'lineaRamas'];  // <-- de moment presuposa que n'hi ha dos
let formas, trunkTypes;
let paletaMarron, paletaVerdes;


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
export function initDNA(pMarron = paletaMarron_base, pVerdes = paletaVerdes_base) {
    formas = shuffle(formas_base);
    trunkTypes = shuffle(trunkTypesBase);
    paletaMarron = shuffle(pMarron);
    paletaVerdes = shuffle(pVerdes);
} 
export class DNA {
    constructor({ crownShape, crownHeight, crownWidth, crownColor, crownOffsetW1, crownOffsetH1, crownOffsetW2, crownOffsetH2, trunkType, trunkHeight, trunkWidth, trunkColor, spaceNeeded, xoffset, yoffset, zone, zoneNum }) {
        this.crownShape = crownShape;
        this.crownHeight = crownHeight;
        this.crownWidth = crownWidth;
        this.crownColor = crownColor;
        this.crownOffsetW1 = crownOffsetW1;
        this.crownOffsetH1 = crownOffsetH1;
        this.crownOffsetW2 = crownOffsetW2;
        this.crownOffsetH2 = crownOffsetH2;
        this.trunkType = trunkType;
        this.trunkHeight = trunkHeight;
        this.trunkWidth = trunkWidth;
        this.trunkColor = trunkColor;
        this.spaceNeeded = spaceNeeded;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.zone = zone;
        this.zoneNum = zoneNum;
    }
    static dnaPosition(x, y, treeDistance, treePosXVariation) {           
        const zone = zoneSystem.getZone(x, y);
        const zoneNum = zoneSystem.zone2Num(zone.id);
        const numZones = zoneSystem.config.zones.length

        // Make crownShape change proportionally to zoneNum
        // zoneNum starts at 1, formas.length is the number of shapes
        // Map zoneNum to [0, formas.length-1]
        const crownShape = selectArrayElement(formas, zoneNum, numZones);
        //const crownWidth =  cwA1 * Math.abs(Math.sin (x/cwTx + cwFx)) + cwA2 * Math.abs(Math.cos (y/cwTy + cwFy));
        const crownWidth = crownWidth0 + noise(x/300, y/300) * 150;
        //const crownHeight = chA1 * Math.abs(Math.sin (x/chTx + chFx)) + chA2 * Math.abs(Math.cos (y/chTy + chFy));
        const crownHeight = crownHeight0 + noise((x+50)/400, (y+50)/30) * 150;
        // Make crownColor proportional to zoneNum
        // Map zoneNum to [0, paletaVerdes.length-1]
        const crownColor = selectArrayElement(paletaVerdes, zoneNum, numZones);
        // Make trunkType dependent on zoneNum (example: even zones 'linea', odd zones 'lineaRamas')
        const crownOffsetW1 = -0.15 + 2 * noise(x,y) * 0.15;
        const crownOffsetH1 = -0.15 + 2 * noise(x,y) * 0.15;
        const crownOffsetW2 = -0.15 + 2 * noise(x,y) * 0.15;
        const crownOffsetH2 = -0.15 + 2 * noise(x,y) * 0.15;
        const trunkType = (zoneNum % 2 === 0) ? trunkTypes[0] : trunkTypes[1];

        const trunkWidth = 10; // 4 + 4 +  14 * sin (x/1000 + Math.PI/2) * cos (y/1000 + Math.PI/2);
        const trunkHeight = 45; // 30 + 30 + 90 * sin (x/1000 + Math.PI/3) * cos (y/1000 + Math.PI/3);
        const trunkColor = selectArrayElement(paletaMarron, zoneNum, numZones);
        const spaceNeeded = Math.max(60, crownWidth * 1.2, trunkHeight * 0.9);
        const xoffset = treeDistance *  (- 1 + 2 * noise(x,y)) * treePosXVariation;  
        const yoffset = treeDistance *  (- 1 + 2 * noise(x,y)) * treePosXVariation; 


        return new DNA({
            crownShape : crownShape
            , crownWidth : crownWidth  
            , crownHeight : crownHeight 
            , crownColor : crownColor
            , crownOffsetW1 : crownOffsetW1
            , crownOffsetH1 : crownOffsetH1
            , crownOffsetW2 : crownOffsetW2
            , crownOffsetH2 : crownOffsetH2
            , trunkType : trunkType
            , trunkHeight : trunkHeight
            , trunkWidth : trunkWidth
            , trunkColor : trunkColor
            , spaceNeeded : spaceNeeded
            , xoffset: xoffset
            , yoffset: yoffset
            , zone: zone
            , zoneNum: zoneNum
        });
    }

}