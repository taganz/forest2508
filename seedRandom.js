
/*

The purpose of seedRandom.js is to provide deterministic (seeded) randomization
- seededRandom(seed): returns a pseudo-random number generator based on a given seed, ensuring repeatable random sequences.
- shuffle(array, seed): shuffles an array using the Fisher-Yates algorithm, but with randomness controlled by the provided seed, so the shuffle result is always the same for the same seed.

*/

let baseSeed = 1234;

export function setBaseSeed(seed) {
  baseSeed = seed;
}

export function seedRandom(seed=baseSeed) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function seedShuffle(array, seed=baseSeed) {
  const random = seedRandom(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}