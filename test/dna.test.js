
// test/factorial.spec.js
const expect  =  chai.expect

import { DNA } from "../DNA.js"


describe('DNA.dnaPosition', () => {

  it('devuelve tamaños fijos y spaceNeeded coherente', () => {
    const dna = DNA.dnaPosition(1000, 2000);

    expect(dna.crownWidth).to.equal(50);
    expect(dna.crownHeight).to.equal(80);
    expect(dna.trunkWidth).to.equal(10);
    expect(dna.trunkHeight).to.equal(45);

    // spaceNeeded = max(60, 50*1.2=60, 45*0.9=40.5) => 60
    expect(dna.spaceNeeded).to.equal(60);
  });

});