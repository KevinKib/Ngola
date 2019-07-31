let Ngola = require('./ngola').Ngola;
const io = require('console-read-write');

class Human {

    constructor(ngola) {
        this.__ngola = ngola;
    }

    /** Thinks and returns a move. */
    async play() {

        console.log('I reached lmao')
        await io.read();
        console.log('I reached lmao 2')
        // io.write(await io.read());

        let randomIndex = Math.floor(Math.random() * this.__ngola.listeLegalMoves.length);
        return this.__ngola.listeLegalMoves[randomIndex];
    }
    
    /** Inits one side of the board. */
    initBoard(index) {
        let ngolaCopy = new Ngola();
        ngolaCopy.initialiserAleatoirementIndex(index);
        return ngolaCopy.plateau.getListeCases(index);
    }

}

module.exports = Human;