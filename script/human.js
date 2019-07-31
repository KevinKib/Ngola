let Ngola = require('./ngola').Ngola;
const io = require('console-read-write');

class Human {

    constructor(ngola) {
        this.__ngola = ngola;
    }

    /** Thinks and returns a move. */
    async play() {

        let selectedCase;

        selectedCase = await io.read();
        console.log('');

        return selectedCase;
    }
    
    /** Inits one side of the board. */
    initBoard(index) {
        let ngolaCopy = new Ngola();
        ngolaCopy.initialiserAleatoirementIndex(index);
        return ngolaCopy.plateau.getListeCases(index);
    }

}

module.exports = Human;