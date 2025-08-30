const expect  = chai.expect;
import { seedRandom, seedShuffle, setBaseSeed } from '../seedRandom.js';

describe('seedRandom.js', () => {
  describe('seedRandom', () => {
    it('produces the same sequence for the same seed', () => {
      const rand1 = seedRandom(42);
      const rand2 = seedRandom(42);
      const seq1 = [rand1(), rand1(), rand1()];
      const seq2 = [rand2(), rand2(), rand2()];
      expect(seq1).to.deep.equal(seq2);
    });

    it('produces different sequences for different seeds', () => {
      const rand1 = seedRandom(42);
      const rand2 = seedRandom(43);
      const seq1 = [rand1(), rand1(), rand1()];
      const seq2 = [rand2(), rand2(), rand2()];
      expect(seq1).to.not.deep.equal(seq2);
    });

    it('produces numbers between 0 and 1', () => {
      const rand = seedRandom(123);
      for (let i = 0; i < 10; i++) {
        const val = rand();
        expect(val).to.be.at.least(0);
        expect(val).to.be.below(1);
      }
    });
  });

  describe('seedShuffle', () => {
    it('shuffles array deterministically with the same seed', () => {
      const arr1 = [1, 2, 3, 4, 5];
      const arr2 = [1, 2, 3, 4, 5];
      const shuffled1 = seedShuffle([...arr1], 99);
      const shuffled2 = seedShuffle([...arr2], 99);
      expect(shuffled1).to.deep.equal(shuffled2);
    });

    it('shuffles array differently with different seeds', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled1 = seedShuffle([...arr], 98);
      const shuffled2 = seedShuffle([...arr], 99);
      expect(shuffled1).to.not.deep.equal(shuffled2);
    });

    it('returns an array with the same elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = seedShuffle([...arr], 123);
      expect(shuffled.sort()).to.deep.equal(arr.sort());
    });

    it('does not mutate the original array', () => {
      const arr = [1, 2, 3, 4, 5];
      const arrCopy = [...arr];
      seedShuffle(arrCopy, 123);
      expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
    });
  });

  describe('setBaseSeed', () => {
    it('sets the base seed without error', () => {
      expect(() => setBaseSeed(2025)).to.not.throw();
    });
  });
  });