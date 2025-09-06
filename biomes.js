// ================= Procedural Infinite Zones (seeded noise) =================

/*

Aquí tienes un enfoque procedural infinito basado 100% en noise (sin librerías externas) con seed reproducible. Genera zonas (biomas) a partir de un campo de ruido “warp-eado”, y te da un getZone(x, y) determinista para cualquier coordenada del plano.
Incluye:
- RNG seedable.
- Value noise 2D + fBM (multi-octava).
- Domain warping para formas orgánicas (evita “cuadrícula”).
- Clasificación en biomas por umbrales (puedes cambiarlos).
- Sugerencia de chunk cache para rendimiento en mapas enormes.

Cómo funciona (en 20 s)
- Generamos un campo escalar z(x,y) con fBM sobre value noise y le aplicamos domain warping para que las isócurvas se vuelvan orgánicas.
- Segmentamos z por umbrales → zonas contiguas (Océano, Bosque, Montaña…).
- Campos secundarios (elev, temp, moist) permiten variantes (Taiga, Sabana, etc.).
- Todo es infinito y determinista: misma seed → mismo mundo; cualquier (x,y) es evaluable sin precomputar.

Ajustes rápidos
- Tamaño de zonas: sube/baja baseFreq (más pequeño = zonas más grandes).
- Suavidad / detalle: cambia octaves, gain, lacunarity.
- Formas: ajusta el warp (freq, amp). Más amp = contornos más retorcidos.
- Tipos de zonas: edita la lista zones y/o las reglas en pickZone.


*/


// <--- OJO, PICK ZONE ESTA FET A MANIJA PER LES ZONES DE L'EXEMPLE ----

// -------------------- Configuración de zonas (biomas) --------------------
// es selecciona la primera zona que te el max mes petit que la z del punt i si no la ultima
// les primeres zones derivades s'assignen a posteriori en funcio dels filds 
const zonesDefault = [
	// derivades
    { id: 'Taiga',      max: -1, color: '#3d6b4b' },
    { id: 'Savanna',    max: -1, color: '#b2c85a' },
    { id: 'High Mountain',  max: -1, color: '#cfc6c3' },
    { id: 'Rainforest',     max: -1, color: '#0f6e3c' },
    { id: 'Glacier',        max: -1, color: '#e8f8ff' },
	// basiques
    { id: 'Ocean',  max: 0.28, color: '#3a6ea5' },
    { id: 'Coast',  max: 0.34, color: '#7fbbe3' },
    { id: 'Meadow', max: 0.52, color: '#77c56b' },
    { id: 'Forest', max: 0.68, color: '#2e8b57' },
    { id: 'Jungle', max: 0.82, color: '#188c4f' },
    { id: 'Mountain',   max: 0.92, color: '#8a7f7a' },
    { id: 'Snow',       max: 1.01, color: '#f0f4f7' },
];






export function createZoneSystem({
  seed = 20250828,  // <-- aquest seed no se per a que serveix
  // escala global del mapa (cuanto menor, más grandes los parches)
  baseFreq = 0.002,
  // parámetros fBM del “campo de zonas”
  zoneNoise = { octaves: 5, lacunarity: 2.0, gain: 0.5 },
  // warping para dar formas orgánicas
  warp = { seed: 777, freq: 0.0015, amp: 120, octaves: 3 },
  // campos adicionales (altura/temperatura/humedad) para enriquecer bioma
  elevNoise = { seed: 11, octaves: 5, freq: 0.0018 },
  tempNoise = { seed: 23, octaves: 4, freq: 0.0009 },
  moistNoise= { seed: 31, octaves: 4, freq: 0.0012 },
  // tabla de zonas por umbrales del campo principal
	zones = zonesDefault
	} = {}) {

	// opcional: cache por chunks para acelerar consultas masivas
	const CHUNK = 256; // píxeles (ajusta a tu “tile size”)
	const cache = new Map(); // key "cx,cy" -> objeto con campos muestreados
	
    // Returns the position (starting from 1) of a biome id in the biomes array, or 0 if not found
	const zone2Num = (id) => {
		const zoneIds = zones.map(b => b.id); // Array of biome ids for easy access
		const idx = zoneIds.indexOf(id);
		return idx === -1 ? 0 : idx + 1;
	};

	function sampleFields(x, y) {
			// 1) domain warp de las coords
			const w = _warp2D(x, y, warp);

			// 2) campo principal de zonas (fBM sobre value-noise)
			const z = _fbm2D(w.x * baseFreq, w.y * baseFreq, {
				seed, ...zoneNoise, freq: 1.0
			});

			// 3) campos auxiliares (también warpeados para coherencia)
			const elev = _fbm2D(w.x * (elevNoise.freq || 1), w.y * (elevNoise.freq || 1),
												 { seed: elevNoise.seed || 11, octaves: elevNoise.octaves || 5, lacunarity: 2, gain: 0.5 });
			const temp = _fbm2D(w.x * (tempNoise.freq || 1), w.y * (tempNoise.freq || 1),
												 { seed: tempNoise.seed || 23, octaves: tempNoise.octaves || 4, lacunarity: 2, gain: 0.5 });
			const moist= _fbm2D(w.x * (moistNoise.freq|| 1), w.y * (moistNoise.freq|| 1),
												 { seed: moistNoise.seed|| 31, octaves: moistNoise.octaves|| 4, lacunarity: 2, gain: 0.5 });

			return { z, elev, temp, moist }; // todos ~[0,1]
		}

	function pickZone(zVal, { elev, temp, moist }) {
		// regla básica por umbral + pequeños matices por campos extra
		// p. ej., si muy frío, convierte Bosque en Tundra, etc.
		let baseZone = zones.find(z => zVal <= z.max) || zones[zones.length - 1];
		let id = baseZone.id;
		let color = baseZone.color;

		// <---- LA PART DE LES VARIACIONS HAURIA DE PASSAR-SE COM UNA FUNCIO PARAMETRE PERQUE DEPEN DE LES ZONES QUE HEM PASSAT. NO HAURIA D'ESTAR AQUI.

		// ejemplos de variaciones (totalmente opcionales):
		if (id === 'Forest' && temp < 0.35) { id = 'Taiga'; color = '#3d6b4b'; }
		if (id === 'Meadow' && moist < 0.3 && temp > 0.6) { id = 'Savanna'; color = '#b2c85a'; }
		if (id === 'Mountain' && elev > 0.8) { id = 'High Mountain'; color = '#cfc6c3'; }
		if (id === 'Jungle' && moist > 0.7 && temp > 0.7) { id = 'Rainforest'; color = '#0f6e3c'; }
		if (id === 'Snow' && temp > 0.6) { id = 'Glacier'; color = '#e8f8ff'; }

		return { id, color };
	}

	
	function getZone(x, y) {
		const f = sampleFields(x, y);
		const zone = pickZone(f.z, f);
		return { ...zone, fields: f }; // devuelve id, color y los campos por si quieres UI
	}

	// --------- (Opcional) muestreo rápido por chunk con caché ---------
	function getZoneCached(x, y) {
			const cx = Math.floor(x / CHUNK), cy = Math.floor(y / CHUNK);
			const key = `${cx},${cy}`;
			let entry = cache.get(key);
			if (!entry) {
				entry = { zones: new Array(CHUNK * CHUNK) };
				// precalcula una textura de zonas para el chunk (si vas a dibujar tiles)
				for (let j = 0; j < CHUNK; j++) {
					for (let i = 0; i < CHUNK; i++) {
						const wx = cx * CHUNK + i;
						const wy = cy * CHUNK + j;
						const { id, color } = getZone(wx, wy);
						entry.zones[j * CHUNK + i] = { id, color };
					}
				}
				cache.set(key, entry);
				// política LRU simple (limita memoria)
				if (cache.size > 64) { // guarda ~64 chunks
					const firstKey = cache.keys().next().value;
					cache.delete(firstKey);
				}
			}
			const lx = ((x % CHUNK) + CHUNK) % CHUNK;
			const ly = ((y % CHUNK) + CHUNK) % CHUNK;
			return entry.zones[ly * CHUNK + lx];
		}

		return { getZone, getZoneCached, zone2Num, config: { seed, baseFreq, zones, warp, zoneNoise } };
}


// --- internes

// --- Hash 2D -> float [0,1) determinista con seed ---
function _hash2D(ix, iy, seed) {
  // mezcla simple pero estable (xorshift-like + constants)
  let h = ix * 374761393 + iy * 668265263 + (seed | 0) * 1274126177;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

// --- Suavizado para interpolación (Perlin-style) ---
function _smoothstep(t) { return t * t * (3 - 2 * t); }

// --- Value noise 2D: interpola 4 valores de las esquinas de la celda ---
function _valueNoise2D(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const tx = x - xi,        ty = y - yi;
  const a = _hash2D(xi,     yi,     seed);
  const b = _hash2D(xi + 1, yi,     seed);
  const c = _hash2D(xi,     yi + 1, seed);
  const d = _hash2D(xi + 1, yi + 1, seed);
  const sx = _smoothstep(tx), sy = _smoothstep(ty);
  const u = a + (b - a) * sx;
  const v = c + (d - c) * sx;
  return u + (v - u) * sy; // [0,1]
}

// --- fBM (fractal Brownian motion) sobre value noise ---
function _fbm2D(x, y, {
		seed = 1337, octaves = 5, lacunarity = 2.0, gain = 0.5, freq = 1.0
		} = {}) {
  let amp = 0.5, f = freq, sum = 0, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum  += amp * _valueNoise2D(x * f, y * f, seed + i * 1013);
    norm += amp;
    amp  *= gain;
    f    *= lacunarity;
  }
  return sum / (norm || 1); // ~[0,1]
}

// --- Domain warping: deforma las coordenadas de entrada con otros ruidos ---
function _warp2D(x, y, {
  seed = 999, freq = 0.0015, amp = 40, // freq: tamaño de deformación; amp: intensidad en píxeles
  octaves = 3
} = {}) {
  // dos campos de desplazamiento ortogonales
  const dx = _fbm2D(x * freq, y * freq, { seed: seed + 17, octaves }) * 2 - 1;
  const dy = _fbm2D(x * freq, y * freq, { seed: seed + 29, octaves }) * 2 - 1;
  return { x: x + dx * amp, y: y + dy * amp };
}


