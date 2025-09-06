const expect  = chai.expect;
import { randomize, random, shuffle } from '../seedRandom.js';

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