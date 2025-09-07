const expect  = chai.expect;
import { randomize, random, shuffle, randomFloat, randomInt } from '../seedRandom.js';

describe('seedRandom.js', () => {
  describe('randomize', () => {
    it('produces the same sequence for the same seed', () => {
      randomize(42);
      const seq1 = [random(), random(), random()];
      randomize(42);
      const seq2 = [random(), random(), random()];
      expect(seq1).to.deep.equal(seq2);
    });

    it('produces different sequences for different seeds', () => {
      randomize(42);
      const seq1 = [random(), random(), random()];
      randomize(43);
      const seq2 = [random(), random(), random()];
      expect(seq1).to.not.deep.equal(seq2);
    });

    it('produces numbers between 0 and 1', () => {
      randomize(123);
      for (let i = 0; i < 10; i++) {
        const val = random();
        expect(val).to.be.at.least(0);
        expect(val).to.be.below(1);
      }
    });
  });

  describe('shuffle', () => {
    it('shuffles array deterministically with the same seed', () => {
      const arr1 = [1, 2, 3, 4, 5];
      const arr2 = [1, 2, 3, 4, 5];
      randomize(99);
      const shuffled1 = shuffle([...arr1]);
      randomize(99);
      const shuffled2 = shuffle([...arr2]);
      expect(shuffled1).to.deep.equal(shuffled2);
    });

    it('shuffles array differently with different seeds', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled1 = shuffle([...arr], 98);
      const shuffled2 = shuffle([...arr], 99);
      expect(shuffled1).to.not.deep.equal(shuffled2);
    });

    it('shuffles array differently without seeds', () => {
      const arr = [1, 2, 3, 4, 5];
      let accumShuffle1 = [], accumShuffle2 = [];
      for (let i = 0; i < 10; i++) {
        accumShuffle1.push(shuffle([...arr]));
        accumShuffle2.push(shuffle([...arr]));
      }
      expect(accumShuffle1).to.not.deep.equal(accumShuffle2);
    });

    it('returns an array with the same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle([...arr], 123);
      expect(shuffled.sort()).to.deep.equal(arr.sort());
    });

    it('does not mutate the original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const arrCopy = [...arr];
      shuffle(arrCopy, 123);
      expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
    });
  });

  describe('setBaseSeed', () => {
    it('sets the base seed without error', () => {
      expect(() => randomize(2025)).to.not.throw();
    });
  });
  });


  describe('seedRandom.js - randomInt and randomFloat', () => {
  beforeEach(() => {
    // Set a known seed before each test for deterministic results
    randomize(42);
  });

  describe('randomInt', () => {
    it('returns an integer within the specified range (inclusive)', () => {
      for (let i = 0; i < 20; i++) {
        const val = randomInt(10, 20);
        expect(val).to.be.at.least(10);
        expect(val).to.be.at.most(20);
        expect(val % 1).to.equal(0);
      }
    });

    it('returns the same sequence for the same seed', () => {
      randomize(123);
      const seq1 = [randomInt(1, 5), randomInt(1, 5), randomInt(1, 5)];
      randomize(123);
      const seq2 = [randomInt(1, 5), randomInt(1, 5), randomInt(1, 5)];
      expect(seq1).to.deep.equal(seq2);
    });
  });

  describe('randomFloat', () => {
    it('returns a float within the specified range', () => {
      for (let i = 0; i < 20; i++) {
        const val = randomFloat(0, 1);
        expect(val).to.be.at.least(0);
        expect(val).to.be.below(1);
      }
    });

    it('returns the same sequence for the same seed', () => {
      randomize(456);
      const seq1 = [randomFloat(0, 10), randomFloat(0, 10), randomFloat(0, 10)];
      randomize(456);
      const seq2 = [randomFloat(0, 10), randomFloat(0, 10), randomFloat(0, 10)];
      expect(seq1).to.deep.equal(seq2);
    });
  });
});