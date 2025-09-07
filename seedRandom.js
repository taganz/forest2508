
/*

The purpose of seedRandom.js is to provide deterministic (seeded) randomization
- random is assigned to a pseudo-random number generator based on a given seed, ensuring repeatable random sequences.
- shuffle(array, seed): shuffles an array using the Fisher-Yates algorithm, but with randomness controlled by the provided seed, so the shuffle result is always the same for the same seed.

Usage:

import { randomize, random} from './seedRandom.js';  
randomize(1234); // initialize the random number generator with/without a seed
use random() to get pseudo-random numbers between 0 and 1

import { shuffle } from './seedRandom.js';
const arr = [1,2,3,4,5];
const shuffledArr = shuffle(arr, 5678); // shuffle arr with seed 5678

*/

let baseSeed = 1234;
export let random = _seedRandom(baseSeed);


export function randomize(seed) {
  if (seed !== undefined) {
    baseSeed = seed;
  } else {
    baseSeed = Math.floor(Math.random() * 10000);
  }
  random = _seedRandom(baseSeed);
  console.log("Base seed randomized to: ", baseSeed);
}

function _seedRandom(seed=baseSeed) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

// utils

export function shuffle(array, seed=baseSeed) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}
export function randomFloat(min, max) {
  return random() * (max - min) + min;
}
