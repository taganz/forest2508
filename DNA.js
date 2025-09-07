import { zoneSystem } from './main.js';
import { random, shuffle, randomFloat, randomInt } from './seedRandom.js';
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
const paletaVerdes_base_2 = ["#38a3a5","#57cc99","#80ed99","#c7f9cc"];
const paletaMarron_base = [
    '#7B4B21', '#8D5524',
    '#A97142', '#5D3A1A'
];

/* model 1 */

//const formas_base = ['triangulo', 'circulo', 'elipse', 'fir'];
//const crownWidth0 = 40; 
//const crownHeight0 = 30;

/* model 2 */

const formas_base = ['watercolor'];
const crownWidth0 = 80; 
const crownHeight0 = 100;


const trunkTypesBase = ['linea', 'lineaRamas'];  // <-- de moment presuposa que n'hi ha dos
let formas, trunkTypes;
let paletaMarron, paletaVerdes;


/*=========================== DNA ===========================*/
export function initDNA(pMarron = paletaMarron_base, pVerdes = paletaVerdes_base) {
    formas = shuffle(formas_base);
    trunkTypes = shuffle(trunkTypesBase);
    paletaMarron = shuffle(pMarron);
    paletaVerdes = shuffle(pVerdes);
} 

/*
  - en dnaFromPosition() no hi pot haver-hi random(), tot ve de la posició amb noise() per a que sigui repetible a cada draw
*/

export function dnaFromPosition(x, y, treeDistance, treePosXVariation) {

        const row = Math.floor(y / treeDistance);
        const xoffsetTresbolillo = treeDistance * 0.5 * (row%2);
        
        const xoffset = treeDistance *  (- 1 + 2 * noise(x,y)) * treePosXVariation + xoffsetTresbolillo;  
        const yoffset = treeDistance *  (- 1 + 2 * noise(x,y)) * treePosXVariation; 
        
        const wx = x + xoffset;
        const wy = y + yoffset;

        const zone = zoneSystem.getZone(wx, wy);
        const zoneNum = zoneSystem.zone2Num(zone.id);
        const numZones = zoneSystem.config.zones.length

        // Make crownShape change proportionally to zoneNum
        const thf = zoneSystem.config.zones[zoneNum-1].treeHeightFactor;
        const twf = zoneSystem.config.zones[zoneNum-1].treeWidthFactor;
        // Map zoneNum to [0, formas.length-1]
        const crownShape = selectArrayElement(formas, zoneNum, numZones);
        const crownWidth = crownWidth0 * twf * (0.95 + 0.1 *noise(wx/300, wy/300));
        const crownHeight = crownHeight0 * thf * (0.95 + 0.1 *noise(wx/300, wy/300));
        // Make crownColor proportional to zoneNum
        // Map zoneNum to [0, paletaVerdes.length-1]
        const crownColor = selectArrayElement(paletaVerdes, zoneNum, numZones);
        const noiseScale = 0.2;
        const crownOffsetW1 = -0.15 + 2 * noise(noiseScale * wx +1,noiseScale * wy +21) * 0.15;
        const crownOffsetH1 = -0.15 + 2 * noise(noiseScale * wx +12,noiseScale * wy +2) * 0.15;
        const crownOffsetW2 = -0.25 + 2 * noise(noiseScale * wx +3,noiseScale * wy +32) * 0.25;
        const crownOffsetH2 = 0.15 - 2 * noise(noiseScale * wx +14,noiseScale * wy +4) * 0.15;

        // Make trunkType dependent on zoneNum (example: even zones 'linea', odd zones 'lineaRamas')
        const trunkType = (zoneNum % 2 === 0) ? trunkTypes[0] : trunkTypes[1];
        const trunkWidth = 10 * thf * (0.9 + 0.2 * noise(wx * 0.005, wy * 0.005));
        const trunkHeight = 45 * twf * (0.9 + 0.2 * noise(wx * 0.004, wy * 0.003));
        const trunkColor = selectArrayElement(paletaMarron, zoneNum, numZones);


        return ({

              x: x
            , y: y
            , xoffset: xoffset
            , yoffset: yoffset

            , zone: zone
            , zoneNum: zoneNum

            , crownShape : crownShape
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


        });
}

