

const expect  =  chai.expect

import { keyPressed, keysDown } from "../input.js"


//// PROVES EN CURS 

describe('input', () => {
  beforeEach(() => {    
    window.loop = function()  {};
    window.noLoop = function() {};
    window.redraw = function() {};
    window.LEFT_ARROW = 37;
    window.RIGHT_ARROW = 39;
    window.UP_ARROW = 38;
    window.DOWN_ARROW = 40;
  });

 it('keyPressed agafa tecles i les posa en keysDown', () => {
    window.key = "";


    window.keyCode = 37; 
    keyPressed();  
    console.log(keysDown)  
    expect(keysDown).to.have.property(37, true);
    expect(keysDown).to.deep.equal({37: true});
    
    window.keyCode = 38; 
    keyPressed();  
    console.log(keysDown)  
    expect(keysDown).to.deep.equal({37: true, 38: true});


  });

it('keyPressed crida a loop si piques un cursor', () => {
    window.keyCode = 37; // 'Q' key
    window.key = "";    

    const spy = sinon.spy(window, 'loop');

    keyPressed();

    expect(spy.called).to.be.true;
    spy.restore();

  });

  it('keyReleased treu totes les tecles aixecades', () => {
    window.keyCode = 37; // 'Q' key
    window.key = "";
    window.keyIsDown = function() {return false};
    
    keysDown[37] = true;
    keysDown[38] = true;
    keysDown[39] = true;
    keysDown[40] = true;
    keyReleased();

    expect(keysDown).to.deep.equal({37: false, 38: false, 39: false, 40: false});

  });


it('keyReleased crida noLoop si tots els cursors estan off', () => {
    window.keyCode = 37; // 'Q' key
    window.key = "";
    window.keyIsDown = function() {return false};
    

    const spy = sinon.spy(window, 'noLoop');

    keysDown[37] = true;
    keysDown[38] = true;
    keysDown[39] = true;
    keysDown[40] = true;
    keyReleased(keysDown);

    expect(spy.called).to.be.true;
    spy.restore();
    
    
});

});