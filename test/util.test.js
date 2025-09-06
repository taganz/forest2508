const expect  = chai.expect
import { selectArrayElement } from '../util.js';

describe('selectArrayElement', () => {
  it('returns first element for index=1', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const result = selectArrayElement(arr, 1, 5);
    expect(result).to.equal('a');
  });

  it('returns last element for index=maxId', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const result = selectArrayElement(arr, 5, 5);
    expect(result).to.equal('e');
  });

  it('returns middle element for index in the middle', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const result = selectArrayElement(arr, 3, 5);
    expect(result).to.equal('c');
  });

  it('handles arrays of different lengths', () => {
    const arr = ['x', 'y', 'z'];
    expect(selectArrayElement(arr, 1, 5)).to.equal('x');
    expect(selectArrayElement(arr, 3, 5)).to.equal('y');
    expect(selectArrayElement(arr, 5, 5)).to.equal('z');
  });

  it('clamps index below 1 to first element', () => {
    const arr = ['a', 'b', 'c'];
    expect(selectArrayElement(arr, 0, 5)).to.equal('a');
  });

  it('returns middle element for index in the middle', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    const result = selectArrayElement(arr, 3, 5);
    expect(result).to.equal('c');
  });

  it('handles arrays of different lengths', () => {
    const arr = ['x', 'y', 'z'];
    expect(selectArrayElement(arr, 1, 5)).to.equal('x');
    expect(selectArrayElement(arr, 3, 5)).to.equal('y');
    expect(selectArrayElement(arr, 5, 5)).to.equal('z');
  });

  it('clamps index below 1 to first element', () => {
    const arr = ['a', 'b', 'c'];
    expect(selectArrayElement(arr, 0, 5)).to.equal('a');
  });

  it('clamps index above maxId to last element', () => {
    const arr = ['a', 'b', 'c'];
    expect(selectArrayElement(arr, 10, 5)).to.equal('c');
  });
});