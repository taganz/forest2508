
// test/factorial.spec.js
const expect  =  chai.expect

import { DNA, initDNA } from "../DNA.js"
import { setBaseSeed } from "../seedRandom.js";


describe('DNA._selectArrayElement', () => {
  beforeEach(() => {
    setBaseSeed(1234);
    initDNA(); // Initialize DNA module with a fixed seed
  });

  it('1 of 5, returns 1', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(DNA._selectArrayElement(arr, 1, 5)).to.equal('a');
  });
  it('2 of 10, returns 1', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(DNA._selectArrayElement(arr, 2, 10)).to.equal('a');
  });
  it('4 of 10, returns 2', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(DNA._selectArrayElement(arr, 4, 10)).to.equal('b');
  });
    it('10 of 10, returns 5', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(DNA._selectArrayElement(arr, 10, 10)).to.equal('e');
  });

});

describe('DNA._selectArrayElement', () => {

  it('returns first element for zoneNum=1', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(DNA._selectArrayElement(arr, 1, 5)).to.equal('a');
  });

  it('returns last element for zoneNum=numZones', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(DNA._selectArrayElement(arr, 5, 5)).to.equal('e');
  });

  it('returns middle element for zoneNum in the middle', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(DNA._selectArrayElement(arr, 3, 5)).to.equal('c');
  });

  it('handles arrays of different lengths', () => {
    const arr = ['x', 'y', 'z'];
    expect(DNA._selectArrayElement(arr, 1, 3)).to.equal('x');
    expect(DNA._selectArrayElement(arr, 3, 6)).to.equal('y');
    expect(DNA._selectArrayElement(arr, 12, 15)).to.equal('z');  // <--?
  });

  it('clamps zoneNum below 1 to first element', () => {
    const arr = ['a', 'b', 'c'];
    expect(DNA._selectArrayElement(arr, 0, 10)).to.equal('a');
  });

  it('clamps zoneNum above numZones to last element', () => {
    const arr = ['a', 'b', 'c'];
    expect(DNA._selectArrayElement(arr, 10, 5)).to.equal('c');
  });
});